document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('dynamic-selects-container');
    const addRowBtn = document.getElementById('add-new-row-btn');
    const form = document.querySelector('form');
    const iframe = document.querySelector("iframe"); // تحديد iframe
    const addNewRowBtn = document.getElementById("add-new-row-btn");

    // Function to create a new row of selects
    function createNewSelectRow() {
        const newRow = document.createElement('div');
        newRow.classList.add('select-row', 'flex', 'flex-wrap', 'gap-6', 'mb-8', 'items-center');
        // <div class="w-full md:w-1/4 text-right">
        //         <p class="font-bold">المجال</p>
        //         <select required name="scope[]"
        //             class="border-b border-gray-500 w-full p-1 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right scope-select">
        //             <option value="" selected>اختيار المجال</option>
        //             <option value="1">التدريس</option>
        //             <option value="2">نواتج التعلم</option>
        //             <option value="3">النشاط المدرسي</option>
        //             <option value="4">التوجيه الطلابي</option>
        //             <option value="5">التطوير المستمر</option>
        //         </select>
        //     </div>
        //     <i class="bi bi-chevron-left self-center"></i>

        newRow.innerHTML = `
        <div class="w-full md:w-1/4 text-right"></div>
        <i class="bi bi-chevron-left self-center"></i>
            <div class="w-full md:w-1/4 text-right  relative">
                <p class="font-bold">مؤشر الأداء</p>
                <select  required name="pointer[]"
                    class="border-b border-gray-500 w-full p-1 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right pointer-select">
                    <option value="" selected>اختيار مؤشر</option>
                </select>
                <div class="custom-pointer-input-group hidden flex items-center mt-2">
                    <input type="text" name="custom_pointer_text[]" class="border-b border-gray-500 w-full p-1 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right custom-pointer-text" placeholder="أدخل مؤشر آخر" disabled>
                    <button type="button" class="close-custom-input-btn pointer-close-btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-1 text-sm">X</button>
                </div>
            </div>
            <i class="bi bi-chevron-left self-center"></i>
            <div class="w-full md:w-1/4 text-right  relative">
                <p class="font-bold">الإجراءات والأساليب المنفذة</p>
                <select  required name="method[]"
                    class="border-b border-gray-500 w-full p-1 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right method-select">
                    <option value="" selected>اختيار إجراء</option>
                    <option value="1">اجتماع</option>
                    <option value="2">حلقة نقاش</option>
                    <option value="3">لقاء</option>
                    <option value="4">ورش عمل</option>
                    <option value="5">مجتمع تعلم مهني</option>
                    <option value="6">برنامج</option>
                    <option value="7">تقرير</option>
                    <option value="add">أخرى</option>
                </select>
                <div class="custom-method-input-group hidden flex items-center mt-2">
                    <input type="text" name="custom_method_text[]" class="border-b border-gray-500 w-full p-1 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-blue-500 text-right custom-method-text" placeholder="أدخل إجراء آخر" disabled>
                    <button type="button" class="close-custom-input-btn method-close-btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-1 text-sm">X</button>
                </div>
            </div>
            <button type="button" class="remove-row-btn text-red-600 self-end cursor-pointer"><i
                                class="bi bi-x-circle"></i></button></button>
        `;

        const selectedScope = container.querySelector('select[name="scope[]"]').value;
        const pointerSelect = newRow.querySelector('select[name="pointer[]"]')

        if (selectedScope != "") {
            var pointerData = scopeJson.find(f => f.scopeId == selectedScope).pointer;
            const pointers = pointerData || [];
            pointers.forEach(pointer => {
                const option = document.createElement('option');
                option.value = pointer.pointerId;
                option.textContent = pointer.label;
                pointerSelect.appendChild(option);
            });

            // Add the "أخرى" option to the pointer select
            const otherPointerOption = document.createElement('option');
            otherPointerOption.value = 'add';
            otherPointerOption.textContent = 'أخرى';
            pointerSelect.appendChild(otherPointerOption);

            pointerSelect.disabled = false;
            pointerSelect.parentElement.classList.remove('opacity-50');
        } else {

        }

        container.appendChild(newRow);
        addEventListenersToRow(newRow); // Add event listeners to the new row
    }

    // Function to handle changes in the scope select
    function handleScopeChange(event) {
        const currentRow = event.target.closest('.select-row');
        const pointerSelect = currentRow.querySelector('.pointer-select');
        const customPointerInputGroup = currentRow.querySelector('.custom-pointer-input-group');
        const customPointerText = currentRow.querySelector('.custom-pointer-text');
        const methodSelect = currentRow.querySelector('.method-select');
        const customMethodInputGroup = currentRow.querySelector('.custom-method-input-group');
        const customMethodText = currentRow.querySelector('.custom-method-text');

        // Reset and disable subsequent selects and hide custom text fields
        pointerSelect.innerHTML = '<option value="" selected>اختيار مؤشر</option>';
        pointerSelect.disabled = true;
        pointerSelect.classList.remove('hidden'); // Ensure select is visible
        pointerSelect.parentElement.classList.add('opacity-50');
        customPointerInputGroup.classList.add('hidden');
        customPointerText.disabled = true;
        customPointerText.value = '';

        methodSelect.innerHTML = '<option value="" selected>اختيار إجراء</option><option value="1">اجتماع</option><option value="2">حلقة نقاش</option><option value="3">لقاء</option><option value="4">ورش عمل</option><option value="5">مجتمع تعلم مهني</option><option value="6">برنامج</option><option value="7">تقرير</option><option value="add">أخرى</option>';
        methodSelect.disabled = true;
        methodSelect.classList.remove('hidden'); // Ensure select is visible
        methodSelect.parentElement.classList.add('opacity-50');
        customMethodInputGroup.classList.add('hidden');
        customMethodText.disabled = true;
        customMethodText.value = '';


        const selectedScope = event.target.value;

        if (selectedScope != "") {
            addNewRowBtn.classList.remove("hidden")
            var pointerData = scopeJson.find(f => f.scopeId == selectedScope).pointer;
            const pointers = pointerData || [];
            pointers.forEach(pointer => {
                const option = document.createElement('option');
                option.value = pointer.pointerId;
                option.textContent = pointer.label;
                pointerSelect.appendChild(option);
            });

            // Add the "أخرى" option to the pointer select
            const otherPointerOption = document.createElement('option');
            otherPointerOption.value = 'add';
            otherPointerOption.textContent = 'أخرى';
            pointerSelect.appendChild(otherPointerOption);

            pointerSelect.disabled = false;
            pointerSelect.parentElement.classList.remove('opacity-50');
        } else {
            addNewRowBtn.classList.add("hidden")
        }
    }

    // Function to handle changes in the pointer select
    function handlePointerChange(event) {
        const currentRow = event.target.closest('.select-row');
        const pointerSelect = event.target;
        const customPointerInputGroup = currentRow.querySelector('.custom-pointer-input-group');
        const customPointerText = currentRow.querySelector('.custom-pointer-text');
        const methodSelect = currentRow.querySelector('.method-select');
        const customMethodInputGroup = currentRow.querySelector('.custom-method-input-group');
        const customMethodText = currentRow.querySelector('.custom-method-text');

        // Hide and disable custom text for pointer, ensure select is visible
        customPointerInputGroup.classList.add('hidden');
        customPointerText.disabled = true;
        customPointerText.value = ''; // Clear previous input
        pointerSelect.classList.remove('hidden');
        pointerSelect.disabled = false; // Re-enable in case it was disabled by 'add'

        // Reset and disable the method select and hide its custom text field
        methodSelect.disabled = true;
        methodSelect.classList.remove('hidden'); // Ensure select is visible
        methodSelect.parentElement.classList.add('opacity-50');
        customMethodInputGroup.classList.add('hidden');
        customMethodText.disabled = true;
        customMethodText.value = ''; // Clear previous input


        const selectedPointer = pointerSelect.value;

        if (selectedPointer === 'add') {
            // If "أخرى" is selected, hide select and show text input group for pointer
            pointerSelect.classList.add('hidden'); // Use add for consistent class handling
            customPointerInputGroup.classList.remove('hidden');
            customPointerText.disabled = false;
            customPointerText.focus(); // Focus on the new input

            // Since "أخرى" is selected, enable the method select
            methodSelect.disabled = false;
            methodSelect.parentElement.classList.remove('opacity-50');
        } else if (selectedPointer) {
            // If a regular pointer is selected, ensure method select is enabled
            methodSelect.value = ""
            methodSelect.disabled = false;
            methodSelect.parentElement.classList.remove('opacity-50');
        }
    }

    // Function to handle changes in the method select
    function handleMethodChange(event) {
        const currentRow = event.target.closest('.select-row');
        const methodSelect = event.target;
        const customMethodInputGroup = currentRow.querySelector('.custom-method-input-group');
        const customMethodText = currentRow.querySelector('.custom-method-text');

        // Hide and disable custom text for method, ensure select is visible
        customMethodInputGroup.classList.add('hidden');
        customMethodText.disabled = true;
        customMethodText.value = ''; // Clear previous input
        methodSelect.classList.remove('hidden');
        methodSelect.disabled = false; // Re-enable in case it was disabled by 'add'


        const selectedMethod = methodSelect.value;

        if (selectedMethod === 'add') {
            // If "أخرى" is selected, hide select and show text input group for method
            methodSelect.disabled = true;
            methodSelect.classList.add('hidden');
            customMethodInputGroup.classList.remove('hidden');
            customMethodText.disabled = false;
            customMethodText.focus(); // Focus on the new input
        }
    }

    // Function to revert from custom text input to select
    function revertToSelect(rowElement, type) {
        const selectElement = rowElement.querySelector(`.${type}-select`);
        const customInputGroup = rowElement.querySelector(`.custom-${type}-input-group`);
        const customTextInput = rowElement.querySelector(`.custom-${type}-text`);

        customInputGroup.classList.add('hidden');
        customTextInput.disabled = true;
        customTextInput.value = ''; // Clear input field
        selectElement.classList.remove('hidden');
        selectElement.disabled = false;
        selectElement.value = ''; // Optionally reset the select to default, or keep "أخرى" selected

        // For pointer, re-enable method select if applicable (e.g., if a previous valid pointer was selected)
        if (type === 'pointer') {
            const methodSelect = rowElement.querySelector('.method-select');
            if (!methodSelect.disabled && methodSelect.classList.contains('hidden')) {
                // This condition handles cases where method was enabled but hidden by custom method input
                methodSelect.classList.remove('hidden');
                methodSelect.disabled = false;
            }
        }
    }


    // Function to add event listeners to a given row
    function addEventListenersToRow(rowElement) {
        const scopeSelect = rowElement.querySelector('.scope-select');
        const pointerSelect = rowElement.querySelector('.pointer-select');
        const methodSelect = rowElement.querySelector('.method-select');
        const removeBtn = rowElement.querySelector('.remove-row-btn');
        const pointerCloseBtn = rowElement.querySelector('.pointer-close-btn');
        const methodCloseBtn = rowElement.querySelector('.method-close-btn');


        if (scopeSelect) {
            scopeSelect.addEventListener('change', handleScopeChange);
        }
        if (pointerSelect) {
            pointerSelect.addEventListener('change', handlePointerChange);
        }
        if (methodSelect) {
            methodSelect.addEventListener('change', handleMethodChange);
        }
        if (removeBtn) {
            removeBtn.addEventListener('click', function () {
                rowElement.remove();
            });
        }
        if (pointerCloseBtn) {
            pointerCloseBtn.addEventListener('click', function () {
                revertToSelect(rowElement, 'pointer');
            });
        }
        if (methodCloseBtn) {
            methodCloseBtn.addEventListener('click', function () {
                revertToSelect(rowElement, 'method');
            });
        }
    }

    // Add event listener to the "Add New Row" button
    addRowBtn.addEventListener('click', createNewSelectRow);

    // Add event listeners to the initial row(s) on page load
    document.querySelectorAll('.select-row').forEach(row => {
        addEventListenersToRow(row);
    });



    // --- SUBMIT FUNCTION ---
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);
        const elements = form.elements;

        formData.date = elements["date"].value;
        formData.advisorName = elements["advisorName"].value;
        formData.team = elements["team"].value;
        formData.advisorName = elements["advisorName"].value;
        formData.stage = elements["stage"].value;
        formData.school = elements["school"].value;
        formData.term = elements["term"].value; // الحقل الثاني job في textarea

        formData.scope = elements["scope[]"].value;
        // formData.scope = Array.from(form.querySelectorAll('select[name="scope[]"]'))
        //     .map(el => el.value)
        //     .filter(v => v);
        formData.pointer = Array.from(form.querySelectorAll('select[name="pointer[]"]'))
            .map(el => el.value)
            .filter(v => v);
        formData.pointer = Array.from(form.querySelectorAll('select[name="pointer[]"]'))
            .map(el => el.value)
            .filter(v => v);
        formData.method = Array.from(form.querySelectorAll('select[name="method[]"]'))
            .map(el => el.value)
            .filter(v => v);

        formData.newPointer = Array.from(form.querySelectorAll('input[name="custom_pointer_text[]"]'))
            .map(el => el.value)
            .filter(v => v);
        formData.newMethod = Array.from(form.querySelectorAll('input[name="custom_method_text[]"]'))
            .map(el => el.value)
            .filter(v => v);;

        formData.category = elements["category"].value;
        formData.job = elements["job"].value;


        // --- Store Data in LocalStorage ---
        try {
            const currentData = JSON.parse(localStorage.getItem("excellenceReport") || "[]");
            currentData.push(formData);
            // حفظها مرة أخرى
            localStorage.setItem("excellenceReport", JSON.stringify(currentData));
            console.log("Data saved to localStorage:", data);
            alert("تم حفظ البيانات في LocalStorage بنجاح!");
            // You might want to reset the form after successful submission
            form.reset();

            if (iframe) {
                iframe.src = iframe.src;
            }

        } catch (e) {
            console.error("Error saving to localStorage:", e);
            alert('Form submitted, but failed to save data locally.');
        }
    });
});