import React from 'react';
import { Link } from 'react-router-dom';

const YearNavigation = () => {
  const years = [
    { id: '2025', label: '2025' },
    { id: '2024', label: '2024' },
    { id: '2023', label: '2023' },
    { id: 'legacy', label: 'Legacy Archive' }
  ];

  const getYearLink = (yearId) => {
    // Legacy Archive goes to /allproducts (no year param)
    if (yearId === 'legacy') {
      return '/allproducts';
    }
    // Other years go to /allproducts?year=XXXX
    return `/allproducts?year=${yearId}`;
  };

  return (
    <div className="bg-[#F4F4F4] border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 text-sm">
          {years.map((year) => (
            <Link
              key={year.id}
              to={getYearLink(year.id)}
              className="pb-3 pt-4 transition-colors relative whitespace-nowrap hover:text-black hover:underline underline-offset-4 flex-1 sm:flex-none text-center sm:text-left"
            >
              {year.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearNavigation;
