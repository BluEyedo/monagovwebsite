import React from "react";
import { AchievementRecord } from "../types";

interface PrintReportProps {
  records: AchievementRecord[];
}

const PrintReport: React.FC<PrintReportProps> = ({ records }) => {
  if (records.length === 0) return null;

  const completedCount = records.filter(
    (r) => r.status === "تم الإنجاز"
  ).length;
  const incompleteCount = records.filter(
    (r) => r.status === "لم يتم الإنجاز"
  ).length;

  return (
    <div className="hidden print:block w-full text-black bg-white p-4 rtl">
      <div class="flex justify-between mb-6">
        <div class="flex flex-col items-center">
          <img class="h-[60px] w-auto" src="ksa.png" />
          <p>وزارة التعليم</p>
          <p>الإدارة العامة للتعليم بمنطقة مكة المكرمة</p>
        </div>
        <img class="h-[120px] w-auto" src="taleem.png" />
      </div>

      {/* Header */}
      <div className="text-center mb-10 border-black pb-6">
        <div className="flex flex-col items-center mt-6 text-xl font-bold">
          <p>تاريخ التقرير: {new Date().toLocaleDateString("ar-SA")}</p>
          {/* {/* <p>مقدم الخدمة دعم التميز المدرسي</p> */}
          <p> أ. منى غالي الصاعدي</p>
        </div>
      </div>

      {/* Summary Statistics */}
      {/* <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="border-2 border-black p-3 rounded-lg">
          <p className="text-xs font-bold mb-1">إجمالي السجلات</p>
          <p className="text-xl font-black">{records.length}</p>
        </div>
        <div className="border-2 border-black p-3 rounded-lg bg-gray-50">
          <p className="text-xs font-bold mb-1 text-green-700">تم الإنجاز</p>
          <p className="text-xl font-black">{completedCount}</p>
        </div>
        <div className="border-2 border-black p-3 rounded-lg bg-gray-50">
          <p className="text-xs font-bold mb-1 text-red-700">لم يتم الإنجاز</p>
          <p className="text-xl font-black">{incompleteCount}</p>
        </div>
      </div> */}

      {/* Main Table */}
      <table className="w-full border-collapse border-2 border-black text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2 w-8">م</th>
            <th className="border border-black p-2">الفصل</th>
            <th className="border border-black p-2">الفريق</th>
            <th className="border border-black p-2">المشرفة</th>
            <th className="border border-black p-2">اليوم</th>
            <th className="border border-black p-2 w-16">التاريخ</th>
            <th className="border border-black p-2">المدرسة</th>
            <th className="border border-black p-2">المرحلة</th>
            <th className="border border-black p-2">حالة الإنجاز</th>
            {/* <th className="border border-black p-2">الشاهد</th> */}
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => (
            <React.Fragment key={rec.id}>
              {index > 0 && (
                <tr className="bg-gray-200 border-t-2 border-black">
                  <th className="border border-black p-2 w-8">م</th>
                  <th className="border border-black p-2">الفصل</th>
                  <th className="border border-black p-2">الفريق</th>
                  <th className="border border-black p-2">المشرفة</th>
                  <th className="border border-black p-2">اليوم</th>
                  <th className="border border-black p-2 ">التاريخ</th>
                  <th className="border border-black p-2">المدرسة</th>
                  <th className="border border-black p-2">المرحلة</th>
                  <th className="border border-black p-2">حالة الإنجاز</th>
                  {/* <th className="border border-black p-2">الشاهد</th> */}
                </tr>
              )}

              <tr className="bg-white">
                <td className="border border-black p-2 text-center font-bold">
                  {index + 1}
                </td>
                <td className="border border-black p-2">{rec.semester}</td>
                <td className="border border-black p-2 font-black">
                  {rec.team}
                </td>
                <td className="border border-black p-2 font-bold">
                  {rec.supervisor}
                </td>
                <td className="border border-black p-2">{rec.day}</td>
                <td className="border border-black p-2 ">{rec.date}</td>
                <td className="border border-black p-2">{rec.school}</td>
                <td className="border border-black p-2">{rec.stage}</td>
                <td className="border border-black p-2 text-center font-black">
                  {rec.status}
                </td>
                {/* <td className="border border-black p-2 text-center">
                  {rec.witness.length > 0
                    ? `مرفق (${rec.witness.length})`
                    : "لا يوجد"}
                </td> */}
              </tr>
              {/* Detailed Inner Table for Domains/KPIs */}
              <tr className="bg-gray-200 font-bold border-b border-black">
                <td colSpan={3} className="p-2 border-l border-black w-1/4">
                  المجال
                </td>
                <td colSpan={3} className="p-2 border-l border-black w-1/2">
                  مؤشر الأداء
                </td>
                <td colSpan={3} className="p-2">
                  الإجراءات والأساليب
                </td>
              </tr>
              {rec.details.map((detail, dIdx) => (
                <tr key={dIdx} className="border-b border-black last:border-0">
                  <td colSpan={3} className="p-2 border-l border-black italic">
                    {dIdx + 1}. {detail.domain}
                  </td>
                  <td colSpan={3} className="p-2 border-l border-black">
                    {dIdx + 1}. {detail.kpi}
                  </td>
                  <td colSpan={3} className="p-2">
                    {dIdx + 1}. {detail.procedure}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      {/* <div className="mt-12 flex justify-between items-end border-t border-black pt-4">
        <div className="text-[10px] italic">
          طُبع بواسطة البوابة التقنية المتطورة -{" "}
          {new Date().toLocaleTimeString("ar-SA")}
        </div>
        <div className="text-center w-48 border-t border-black pt-2">
          <p className="font-bold">توقيع المعتمد</p>
        </div>
      </div> */}
    </div>
  );
};

export default PrintReport;
