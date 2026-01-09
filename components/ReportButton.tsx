
import React from 'react';

interface ReportButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative group flex flex-col items-center justify-center
        h-[150px] sm:h-auto
        w-full max-w-md aspect-[16/9] md:aspect-[21/9]
        bg-gradient-to-b from-[#f26c5a] to-[#c13023]
        rounded-xl shadow-[0_0_40px_rgba(193,48,35,0.4)]
        hover:shadow-[0_0_60px_rgba(193,48,35,0.6)]
        active:scale-95 transition-all duration-300
        border-t border-white/20
        overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-xl font-bold">جاري تحضير التقرير الذكي...</span>
        </div>
      ) : (
        <>
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 scale-75 sm:scale-100">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM7 10H11V8H7V10ZM19 21H5C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 3 19.55 3 19V5C3 4.45 3.195 3.979 3.587 3.587C3.979 3.195 4.45 3 5 3H14L21 10V19C21 19.55 20.804 20.02 20.412 20.412C20.02 20.804 19.55 21 19 21ZM13 9V5H5V19H19V11H13V9Z" fill="#ffde33"/>
             </svg>
          </div>
          <span className=" sm:text-xl font-black text-center px-8 leading-tight drop-shadow-md">
            تقرير إنجاز مقدم خدمات دعم التميز المدرسي
          </span>
        </>
      )}
    </button>
  );
};

export default ReportButton;
