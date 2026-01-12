import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const YearNavigation = () => {
  const location = useLocation();
  const [availableYears, setAvailableYears] = useState([]);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch(`${API_URL}/products/timeline`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const years = result.data.map(d => d._id).sort((a, b) => b - a);
        setAvailableYears(years.slice(0, 4)); // Show top 4 years
      }
    } catch (err) {
      console.error('Error fetching years:', err);
      // Fallback to static years
      setAvailableYears([2025, 2024, 2023]);
    }
  };

  const handleYearClick = (e, year) => {
    if (isHomePage) {
      e.preventDefault();
      // Scroll to the year section on home page
      const yearSection = document.getElementById(`year-section-${year}`);
      if (yearSection) {
        const offset = 100;
        const elementPosition = yearSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      } else {
        // If section doesn't exist on homepage, navigate to allproducts with year filter
        window.location.href = `/allproducts?year=${year}`;
      }
    }
  };

  const getYearLink = (yearId) => {
    if (yearId === 'legacy') {
      return '/allproducts';
    }
    return `/allproducts?year=${yearId}`;
  };

  return (
    <div className="bg-[#F4F4F4] border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 text-sm overflow-x-auto">
          {availableYears.map((year) => (
            <Link
              key={year}
              to={getYearLink(year)}
              onClick={(e) => handleYearClick(e, year)}
              className="pb-3 pt-4 transition-colors relative whitespace-nowrap hover:text-black hover:underline underline-offset-4 flex-shrink-0"
            >
              {year}
            </Link>
          ))}
          <Link
            to="/allproducts"
            className="pb-3 pt-4 transition-colors relative whitespace-nowrap hover:text-black hover:underline underline-offset-4 flex-shrink-0"
          >
            Legacy Archive
          </Link>
        </div>
      </div>
    </div>
  );
};

export default YearNavigation;
