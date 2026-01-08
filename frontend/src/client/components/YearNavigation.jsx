import React, { useState } from 'react';

const YearNavigation = () => {
  const [activeYear, setActiveYear] = useState('2025');

  const years = [
    { id: '2025', label: '2025' },
    { id: '2024', label: '2024' },
    { id: '2023', label: '2023' },
    { id: 'legacy', label: 'Legacy Archive' }
  ];

  return (
    <div className="bg-[#F4F4F4] border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 text-sm">
          {years.map((year) => (
            <button
              key={year.id}
              onClick={() => setActiveYear(year.id)}
              className={`pb-3 pt-4 transition-colors relative whitespace-nowrap ${
                activeYear === year.id
                  ? 'font-bold text-black'
                  : 'font-normal text-[#8E8E8E] hover:text-[#333333]'
              }`}
            >
              {year.label}
              {activeYear === year.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearNavigation;
