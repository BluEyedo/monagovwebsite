// tableActions.js
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printBtn");
  const exportBtn = document.getElementById("excelBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  // طباعة الجدول
  printBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("excellenceReport") || "[]");

    let html = `
      <html dir="rtl">
        <head>
          <title>_</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
          
          @media print {
            @page {
              size: landscape;
            }
          }

           @page {
                @top-center { content: none; }
                @top-left { content: none; }
                @top-right { content: none; }
                @bottom-left { content: none; }
                @bottom-center { content: none; }
                @bottom-right { content: none; }
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #000;
              text-align: right;
            }
            th {
              background-color: #eee;
            }
            img {
              width: 50px;
              height: 50px;
            }
      
          </style>
        </head>
        <body class="cairo-font">
        
          <div class="px-4">
            <div class="flex justify-between mb-6">
              <div class="flex flex-col items-center">
                <img class="h-[60px] w-auto" src="../ksa.png" />
                <p>وزارة التعليم</p>
                <p>الإدارة العامة للتعليم بمنطقة مكة المكرمة</p>
              </div>
              <img class="h-[120px] w-auto" src="../taleem.png" />
            </div>
  
            <p class="font-bold text-xl text-center">مقدم خدمات دعم التميز المدرسي</p>
            <p class="font-bold text-xl text-center mb-5">
              أ. منى غالي غانم الصاعدي
            </p>
            <table>
              <thead>
                <tr>
                <th class="text-center text-xs border px-4 py-2 w-[10px]">م</th>
                <th class="text-center text-xs border px-4 py-2 w-[100px]">الفصل</th>
                <th class="text-center text-xs border px-4 py-2">الفريق</th>
                <th class="text-center text-xs border px-4 py-2">المشرفة</th>
                <th class="text-center text-xs border px-4 py-2 w-[45px]">اليوم</th>
                <th class="text-center text-xs border px-4 py-2 w-[95px]">التاريخ</th>
                <th class="text-center text-xs border px-4 py-2">المدرسة</th>
                <th class="text-center text-xs border px-4 py-2">المرحلة</th>
                <th class="text-center text-xs border px-4 py-2 w-[80px]">حالة الإنجاز</th>
                <th class="text-center text-xs border px-4 py-2">الشاهد</th>
                </tr>
              </thead>
              <tbody>
                ${data
        .map((item, index) => {
          let pIx = 0;
          let mIx = 0;

          const scopeList =
            item.scope
              ?.map((s, i) => {
                const scope = scopeJson.find((f) => f.scopeId == s);
                return scope
                  ? `<p class="mb-1">${i + 1}. ${scope.label}</p>`
                  : "";
              })
              .join("") || "";

          const pointerList =
            item.pointer
              ?.map((p, i) => {
                if (p == "add") {
                  pIx += 1;
                  return `<p class="mb-1">${i + 1}. ${item.newPointer?.[pIx - 1] || ""
                    }</p>`;
                } else {
                  const pointer = pointerJson.find(
                    (f) => f.pointerId == p
                  );
                  return pointer
                    ? `<p class="mb-1">${i + 1}. ${pointer.label}</p>`
                    : "";
                }
              })
              .join("") || "";

          const methodList =
            item.method
              ?.map((m, i) => {
                if (m == "add") {
                  mIx += 1;
                  return `<p class="mb-1">${i + 1}. ${item.newMethod?.[mIx - 1] || ""
                    }</p>`;
                } else {
                  const method = methodJson.find(
                    (f) => f.methodId == m
                  );
                  return method
                    ? `<p class="mb-1">${i + 1}. ${method.label}</p>`
                    : "";
                }
              })
              .join("") || "";

          return `
                  ${index > 0
              ? `
                  <tr>
              <th class="text-center text-xs border px-4 py-2 w-[10px]">م</th>
              <th class="text-center text-xs border px-4 py-2 w-[100px]">الفصل</th>
              <th class="text-center text-xs border px-4 py-2">الفريق</th>
              <th class="text-center text-xs border px-4 py-2">المشرفة</th>
              <th class="text-center text-xs border px-4 py-2 w-[45px]">اليوم</th>
              <th class="text-center text-xs border px-4 py-2 w-[95px]">التاريخ</th>
              <th class="text-center text-xs border px-4 py-2">المدرسة</th>
              <th class="text-center text-xs border px-4 py-2">المرحلة</th>
              <th class="text-center text-xs border px-4 py-2 w-[80px]">حالة الإنجاز</th>
              <th class="text-center text-xs border px-4 py-2">الشاهد</th>
              </tr>
                  `
              : ``
            }
                  <tr class="border-0">
                  <td class="text-xs border px-4 py-2">${index + 1}</td>
                  <td class="text-xs border px-4 py-2">${item.term == "1" ? "الفصل الأول" : "الفصل الثاني"
            }</td>
                  <td class="text-xs border px-4 py-2">${item.team}</td>
                  <td class="text-xs border px-4 py-2">
                    ${item.advisorName}
                    </td>
                    <td class="text-xs border px-4 py-2">
                    ${item.day} 
                    </td>
                    <td class="text-xs border px-4 py-2">${item.date}</td>
                  <td class="text-xs border px-4 py-2">${item.school}</td>
                  <td class="text-xs border px-4 py-2">
          ${item.stage == "1" ? "طفولة مبكرة" : ""}
          ${item.stage == "2" ? "ابتدائي" : ""}
          ${item.stage == "3" ? "متوسط" : ""}
          ${item.stage == "4" ? "ثانوي" : ""}
                    </td>
                <td class="text-xs border  px-2">${item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"
            }</td>
                <td class="text-xs border text-xs px-2">
                ${item.barcodeImage
              ? `<img src="${item.barcodeImage}" alt="barcode" class="w-16 h-16 mx-auto"/>`
              : ""
            }
              </td>
                  </tr >

                  <tr>
                    <td colspan="11" class="border-0 p-0">
                    <div class=" bg-white">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="text-center text-xs border px-4 py-2 w-1/3">المجال</th>
                    <th class="text-center text-xs border px-4 py-2 w-1/3">مؤشر الأداء</th>
                    <th class="text-center text-xs border px-4 py-2 w-1/3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-xs border px-4 py-2 align-top">${scopeList}</td>
                    <td class="text-xs border px-4 py-2 align-top text-start">${pointerList}</td>
                    <td class="text-xs border px-4 py-2 align-top text-start">${methodList}</td>
                  </tr>
                </tbody>
              </table>
            </div>
                    </td>
                  </tr>
      `;
        })
        .join("")}
              </tbody>
            </table>
          </div>
  
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  });

  // تصدير إلى Excel
  exportBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("excellenceReport") || "[]");

    let csv = `م,الفصل,الفريق,المشرفة,اليوم,التاريخ,المدرسة,المرحلة,المجال,مؤشر الأداء,الإجراءات,حالة الإنجاز,الشاهد\n`;

    data.forEach((item, index) => {
      const clean = (str) => `"${(str || "").toString().replace(/"/g, '""')}"`;
      var scope = scopeJson.find((f) => f.scopeId == item.scope);
      var pIx = 0;
      var mIx = 0;

      csv +=
        [
          index + 1, // م
          item.term == "1" ? "الفصل الأول" : "الفصل الثاني", // الفصل
          item.team, // الفريق
          item.advisorName, // المشرفة
          item.day, // اليوم
          item.date, // التاريخ
          item.school, // المدرسة
          item.stage == "1"
            ? "طفولة مبكرة"
            : item.stage == "2"
              ? "ابتدائي"
              : item.stage == "3"
                ? "متوسط"
                : "ثانوي", // المرحلة
          item.scope
            .map((s) => {
              const scope = scopeJson.find((f) => f.scopeId == s);
              return scope ? scope.label : "";
            })
            .join(" / "), // المجال
          item.pointer
            .map((p) => {
              if (p === "add") {
                pIx += 1;
                return item.newPointer[pIx - 1];
              } else {
                const pointer = pointerJson.find((f) => f.pointerId == p);
                return pointer ? pointer.label : "";
              }
            })
            .join(" / "), // مؤشر الأداء
          item.method
            .map((m) => {
              if (m === "add") {
                mIx += 1;
                return item.newMethod[mIx - 1];
              } else {
                const method = methodJson.find((f) => f.methodId == m);
                return method ? method.label : "";
              }
            })
            .join(" / "), // الإجراءات
          item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز", // حالة الإنجاز
          // item.barcodeImage || "" // الشاهد
        ].join(",") + "\n";
    });

    // إضافة BOM في بداية CSV لحل مشكلة العربية
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير_إنجاز_مقدم_خدمات_دعم_التميز_المدرسي.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  // حذف كامل البيانات
  deleteBtn.addEventListener("click", () => {
    if (confirm("هل أنت متأكد من حذف جميع البيانات؟")) {
      localStorage.removeItem("excellenceReport");
      alert("تم حذف جميع البيانات!");
      // إعادة تحميل iframe إذا موجود
      // const iframe = document.querySelector("iframe");
      // if (iframe) iframe.src = iframe.src;

      window.URL.reload();

      // حساب المهام المكتملة وغير المكتملة
      const done = data.filter((item) => item.category == "1").length;
      const notDone = data.filter((item) => item.category == "2").length;

      // عرض الأرقام
      document.getElementById(
        "doneCount"
      ).textContent = `🟢 تم إنجازه: ${done}`;
      document.getElementById(
        "notDoneCount"
      ).textContent = `🔴  لم يتم إنجازه: ${notDone}`;
    }
  });
});
