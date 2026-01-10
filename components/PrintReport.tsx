import React from "react";
import { AchievementRecord } from "../types";

interface PrintReportProps {
  records: AchievementRecord[];
  fixedData: any;
}

const PrintReport: React.FC<PrintReportProps> = ({ records, fixedData }) => {
  if (records.length === 0) return null;

  const HeaderRow = () => (
    <tr className="bg-gray-200 font-bold">
      <th className="border border-black p-2 w-8">م</th>
      <th className="border border-black p-2">اليوم</th>
      <th className="border border-black p-2 w-20">التاريخ</th>
      <th colSpan={3} className="border border-black p-2">
        المدرسة
      </th>
      <th className="border border-black p-2">المرحلة</th>
      <th className="border border-black p-2">حالة الإنجاز</th>
    </tr>
  );

  return (
    <div className="hidden print:block">
      <img className="w-full mb-4" src="header.png" />

      <div className="w-full text-black bg-white p-4 rtl">
        <table className="mb-10">
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th colSpan={2}>البيانات الأولية</th>
              {/* <th>اسم المشرفة</th>
              <th>الفصل الدراسي</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width={"300px"} className="!bg-gray-200 font-bold" >الفريق</td>
              <td  >{fixedData?.team}</td>
            </tr>
            <tr>
              <td width={"300px"} className="!bg-gray-200 font-bold"> إسم المشرفة</td>
              <td  >{fixedData?.supervisor}</td>
            </tr>
            <tr>
              <td width={"300px"} className="!bg-gray-200 font-bold"> الفصل الدراسي</td>
              <td  >{fixedData?.semester}</td>
            </tr>
          </tbody>
        </table>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {records.map((rec, index) => (
              <React.Fragment key={rec.id}>
                {/* 🔁 HEADER BEFORE EACH RECORD */}
                <HeaderRow />

                {/* MAIN ROW */}
                <tr>
                  <td
                    colSpan={1}
                    className="w-1 border border-black p-2 text-center font-bold"
                  >
                    {index + 1}
                  </td>
                  <td className="border border-black p-2">{rec.day}</td>
                  <td className="border border-black p-2">{rec.date}</td>
                  <td colSpan={3} className="border border-black p-2">
                    {rec.school}
                  </td>
                  <td className="border border-black p-2">{rec.stage}</td>
                  <td className="border border-black p-2 text-center font-black">
                    {rec.status}
                  </td>
                </tr>

                {/* DETAILS */}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={3} className="border border-black p-2 w-1/4">
                    المجال
                  </td>
                  <td colSpan={3} className="border border-black p-2 w-1/2">
                    مؤشر الأداء
                  </td>
                  <td colSpan={3} className="border border-black p-2">
                    الإجراءات والأساليب
                  </td>
                </tr>
                {rec.details.map((detail, dIdx) => (
                  <tr
                    key={dIdx}
                    className={`${
                      dIdx == rec.details.length - 1
                        ? "border-b-2 border-black"
                        : ""
                    }`}
                  >
                    <td colSpan={3} className="border border-black p-2">
                      {dIdx + 1}. {detail.domain}
                    </td>
                    <td colSpan={3} className="border border-black p-2">
                      {dIdx + 1}. {detail.kpi}
                    </td>
                    <td colSpan={3} className="border border-black p-2">
                      {dIdx + 1}. {detail.procedure}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintReport;
