"use client";
import React, { useState, useRef } from "react";
import { AchievementRecord, AchievementDetail } from "../types";
import { scopeJson, methodJson } from "../data/selectData";
import { DAYS_OF_WEEK, HIJRI_MONTHS } from "@/data/hijriDate";

interface ExtendedDetail extends AchievementDetail {
  isCustomDomain?: boolean;
  isCustomKpi?: boolean;
}

interface AchievementFormProps {
  onAdd: (record: AchievementRecord) => void;
  onFix: (e: any) => void;
  onBack: () => void;
  onPreviewImage: (url: string) => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
  onAdd,
  onFix,
  onBack,
  onPreviewImage,
}) => {
  const [formFixedData, setFormFixedData] = useState({
    team: "بحرة",
    supervisor: "",
    semester: "الفصل الأول",
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    var fixedData = localStorage.getItem("fixedData");
    if(fixedData){
      const parsedData = JSON.parse(fixedData);
      setFormFixedData(parsedData);
    }
  }, []);

  const [formData, setFormData] = useState({
    day: "",
    stage: "",
    school: "",
    status: "",
  });

  const [hijriDate, setHijriDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [details, setDetails] = useState<ExtendedDetail[]>([
    {
      domain: "",
      kpi: "",
      procedure: "",
      isCustomDomain: false,
      isCustomKpi: false,
    },
  ]);

  const [images, setImages] = useState<string[]>([]);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [triedSubmitFixed, setTriedSubmitFixed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addDetailRow = () => {
    setDetails([
      ...details,
      {
        domain: "",
        kpi: "",
        procedure: "",
        isCustomDomain: false,
        isCustomKpi: false,
      },
    ]);
  };

  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const updateDetail = (
    index: number,
    field: keyof ExtendedDetail,
    value: any
  ) => {
    const newDetails = [...details];
    (newDetails[index] as any)[field] = value;

    // Auto-switch to custom mode if "أخرى" is selected
    if (field === "domain" && value === "أخرى") {
      newDetails[index].isCustomDomain = true;
      newDetails[index].domain = "";
    }
    if (field === "kpi" && value === "أخرى") {
      newDetails[index].isCustomKpi = true;
      newDetails[index].kpi = "";
    }

    // Reset KPI if domain changes and not in custom KPI mode
    if (field === "domain" && !newDetails[index].isCustomKpi) {
      newDetails[index].kpi = "";
    }
    setDetails(newDetails);
  };

  const isRowComplete = (row: AchievementDetail) =>
    row.domain && row.kpi && row.procedure;
  const isDetailsValid = details.some(isRowComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);

    const isBasicValid =
      // formData.supervisor &&
      formData.day &&
      hijriDate.day &&
      hijriDate.month &&
      formData.stage &&
      formData.school &&
      formData.status;

    if (!isBasicValid || !isDetailsValid) {
      return;
    }

    if (window.confirm(`هل أنت متأكد من حفظ هذا السجل وإضافته؟`)) {
      alert("تم إضافةالبيانات بنجاح");
    }

    const formattedDate = `${hijriDate.day} ${hijriDate.month} ${hijriDate.year}`;

    // Strip UI-only properties before adding
    const cleanDetails: AchievementDetail[] = details
      .filter(isRowComplete)
      .map(({ domain, kpi, procedure }) => ({ domain, kpi, procedure }));

    onAdd({
      id: Date.now(),
      // semester: formData.semester,
      // team: formData.team,
      // supervisor: formData.supervisor,
      day: formData.day,
      date: formattedDate,
      school: formData.school,
      stage: formData.stage,
      status: formData.status,
      details: cleanDetails,
      witness: images,
    });

    // Reset only variable fields: images, details, and status
    setImages([]);
    setDetails([
      {
        domain: "",
        kpi: "",
        procedure: "",
        isCustomDomain: false,
        isCustomKpi: false,
      },
    ]);
    setFormData((prev) => ({ ...prev, status: "" }));
    setTriedSubmit(false);
  };

  const handleSubmitFixed = (e) => {
    e.preventDefault();
    setTriedSubmitFixed(true);

    const isValid =
      formFixedData.supervisor && formFixedData.team && formFixedData.semester;

    if (!isValid || !isValid) {
      return;
    }

    alert("تم تثبيت البيانات بنجاح");

    onFix({
      supervisor: formFixedData.supervisor,
      team: formFixedData.team,
      semester: formFixedData.semester,
    });
    setTriedSubmitFixed(false);
  };

  const getInputClasses = (value: any) => {
    const base =
      "w-full border-b outline-none py-1 text-right bg-transparent transition-colors ";
    const error = "border-red-500 bg-red-50/50";
    const normal = "border-gray-300 focus:border-blue-500";
    return base + (triedSubmit && !value ? error : normal);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-800 p-8">
      <div className="flex justify-between items-start mb-10">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold border-black inline-block pb-1">
            تقرير إنجاز مقدم خدمات دعم التميز المدرسي
          </h1>
        </div>
        <button
          onClick={onBack}
          className="border border-blue-500 text-blue-500 px-4 py-1 rounded-md text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 no-print"
        >
          <span>الرئيسية</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmitFixed} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5 border-2 p-5 rounded-lg">
          <p className="text-xl text-center font-bold col-span-4">البيانات الأولية</p>

          <div className="space-y-2">
            <label className="block text-sm font-bold">الفريق التنفيذي</label>
            <input
              readOnly
              type="text"
              value={formFixedData.team}
              onChange={(e) =>
                setFormFixedData({ ...formFixedData, team: e.target.value })
              }
              className={getInputClasses(formFixedData.team)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold">اسم المشرفة</label>
            <input
              type="text"
              value={formFixedData.supervisor}
              onChange={(e) =>
                setFormFixedData({
                  ...formFixedData,
                  supervisor: e.target.value,
                })
              }
              className={getInputClasses(formFixedData.supervisor)}
            />
            {triedSubmitFixed && !formFixedData.supervisor && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <label className="block text-sm font-bold mb-2">
              الفصل الدراسي
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="semester"
                  value="الفصل الأول"
                  checked={formFixedData.semester === "الفصل الأول"}
                  onChange={(e) =>
                    setFormFixedData({
                      ...formFixedData,
                      semester: e.target.value,
                    })
                  }
                />
                الفصل الأول
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="semester"
                  value="الفصل الثاني"
                  checked={triedSubmitFixed.semester === "الفصل الثاني"}
                  onChange={(e) =>
                    setFormFixedData({
                      ...formFixedData,
                      semester: e.target.value,
                    })
                  }
                />
                الفصل الثاني
              </label>
            </div>
          </div>
          <div className="col-span-4 flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-2 px-10 rounded-2xl shadow-xl transition-all active:scale-95 transform hover:-translate-y-1"
            >
              تثبيت البيانات
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="">
            <label className="block text-sm font-bold">اليوم</label>
            <select
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              className={getInputClasses(formData.day)}
            >
              <option value="">اختر اليوم</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {triedSubmit && !formData.day && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold">التاريخ (هجري)</label>
            <div className="flex gap-1">
              <select
                value={hijriDate.day}
                onChange={(e) =>
                  setHijriDate({ ...hijriDate, day: e.target.value })
                }
                className={getInputClasses(hijriDate.day)}
              >
                <option value="">اليوم</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={hijriDate.month}
                onChange={(e) =>
                  setHijriDate({ ...hijriDate, month: e.target.value })
                }
                className={getInputClasses(hijriDate.month)}
              >
                <option value="">الشهر</option>
                {HIJRI_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={hijriDate.year}
                onChange={(e) =>
                  setHijriDate({ ...hijriDate, year: e.target.value })
                }
                className={getInputClasses(hijriDate.year)}
              >
                <option value="">السنة</option>
                {Array.from({ length: 31 }, (_, i) => 1430 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {triedSubmit && (!hijriDate.day || !hijriDate.month) && (
              <p className="text-[10px] text-red-500 font-bold">
                التاريخ مطلوب
              </p>
            )}
          </div>
        </div>

        {/* Stage & School */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold">المرحلة</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
            >
              <option value="">اختر المرحلة</option>
              <option value="طفولة مبكرة">طفولة مبكرة</option>
              <option value="ابتدائي">ابتدائي</option>
              <option value="متوسط">متوسط</option>
              <option value="ثانوي">ثانوي</option>
            </select>
            {triedSubmit && !formData.stage && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold">المدرسة</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              className={getInputClasses(formData.school)}
              placeholder="أدخل اسم المدرسة"
            />
            {triedSubmit && !formData.school && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Detail Rows */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-lg">تفاصيل الإنجاز</h3>
          </div>

          {triedSubmit && !isDetailsValid && (
            <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs font-bold">
              يرجى إكمال صف واحد على الأقل بكافة حقوله (المجال، المؤشر، الإجراء)
            </div>
          )}

          <div className="space-y-4">
            {details.map((row, idx) => {
              const selectedScope = scopeJson.find(
                (s) => s.label === row.domain
              );
              const availablePointers = selectedScope
                ? selectedScope.pointer
                : [];

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg relative border border-transparent hover:border-blue-100 transition-colors"
                >
                  {details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetailRow(idx)}
                      className="absolute -left-2 -top-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md transition-all z-10"
                    >
                      &times;
                    </button>
                  )}

                  {/* Domain Field */}
                  <div className="space-y-1 relative">
                    <label className="block text-xs font-bold text-gray-500">
                      المجال
                    </label>
                    {row.isCustomDomain ? (
                      <div className="relative group">
                        <input
                          type="text"
                          value={row.domain}
                          onChange={(e) =>
                            updateDetail(idx, "domain", e.target.value)
                          }
                          className={getInputClasses(row.domain)}
                          placeholder="اكتب المجال هنا..."
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDetail(idx, "isCustomDomain", false)
                          }
                          className="absolute left-0 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1 bg-white/50 rounded-full"
                          title="العودة للقائمة"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <select
                        value={row.domain}
                        onChange={(e) =>
                          updateDetail(idx, "domain", e.target.value)
                        }
                        className={getInputClasses(row.domain)}
                      >
                        <option value="">اختيار المجال</option>
                        {scopeJson.map((s) => (
                          <option key={s.scopeId} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                        <option
                          value="أخرى"
                          className="font-bold text-blue-600 italic"
                        >
                          أخرى (كتابة يدوية)...
                        </option>
                      </select>
                    )}
                  </div>

                  {/* KPI Field */}
                  <div className="space-y-1 relative">
                    <label className="block text-xs font-bold text-gray-500">
                      مؤشر الأداء
                    </label>
                    {row.isCustomKpi ? (
                      <div className="relative group">
                        <input
                          type="text"
                          value={row.kpi}
                          onChange={(e) =>
                            updateDetail(idx, "kpi", e.target.value)
                          }
                          className={getInputClasses(row.kpi)}
                          placeholder="اكتب المؤشر هنا..."
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDetail(idx, "isCustomKpi", false)
                          }
                          className="absolute left-0 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1 bg-white/50 rounded-full"
                          title="العودة للقائمة"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <select
                        value={row.kpi}
                        onChange={(e) =>
                          updateDetail(idx, "kpi", e.target.value)
                        }
                        className={getInputClasses(row.kpi)}
                        disabled={!row.domain && !row.isCustomDomain}
                      >
                        <option value="">اختيار المؤشر</option>
                        {availablePointers.map((p) => (
                          <option key={p.pointerId} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                        <option
                          value="أخرى"
                          className="font-bold text-blue-600 italic"
                        >
                          أخرى (كتابة يدوية)...
                        </option>
                      </select>
                    )}
                  </div>

                  {/* Procedure Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500">
                      الإجراءات والأساليب المنفذة
                    </label>
                    <select
                      value={row.procedure}
                      onChange={(e) =>
                        updateDetail(idx, "procedure", e.target.value)
                      }
                      className={getInputClasses(row.procedure)}
                    >
                      <option value="">اختيار الإجراء</option>
                      {methodJson.map((m) => (
                        <option key={m.methodId} value={m.label}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={addDetailRow}
              className="text-blue-600 text-xs font-black flex items-center gap-1 bg-blue-50 px-6 py-2 rounded-full hover:bg-blue-100 transition-all shadow-sm active:scale-95"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              إضافة صف
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-start-3 space-y-1">
            <label className="block text-sm font-bold">حالة الإنجاز</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={getInputClasses(formData.status)}
            >
              <option value="">اختر حالة الإنجاز</option>
              <option value="تم الإنجاز">تم الإنجاز</option>
              <option value="لم يتم الإنجاز">لم يتم الإنجاز</option>
            </select>
            {triedSubmit && !formData.status && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div className="flex flex-col items-center gap-6 py-6 border-t border-gray-100">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-md:max-w-xs w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 group"
          >
            <div className="mb-2 text-gray-400 group-hover:text-blue-500 transition-colors">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 font-bold">
              ارفق صور الشواهد بالضغط هنا او سحب الصور إلى هنا
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {images.length > 0 && (
            <div className="w-full max-w-4xl grid grid-cols-4 md:grid-cols-8 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={img}
                    alt="upload"
                    className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm cursor-zoom-in group-hover:brightness-75 transition-all"
                    onClick={() => onPreviewImage(img)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md hover:bg-red-600 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-4 px-24 rounded-2xl shadow-xl transition-all active:scale-95 transform hover:-translate-y-1"
          >
            إضافة البيانات
          </button>
        </div>
      </form>
    </div>
  );
};

export default AchievementForm;