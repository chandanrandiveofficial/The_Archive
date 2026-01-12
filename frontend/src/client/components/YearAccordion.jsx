import { FaChevronDown } from "react-icons/fa";
import MonthSection from "./MonthSection";

export default function YearAccordion({ yearData, activeCategory }) {
  const { year, subtitle, months } = yearData;

  return (
    <details className="border-b border-gray-200 group">
      <summary className="flex justify-between items-center py-10 cursor-pointer">
        <div>
          <h2 className="text-4xl font-bold">{year}</h2>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </div>

        <FaChevronDown className="transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <div className="pb-10">
        {months.map((month) => (
          <MonthSection
            key={month.name}
            month={month}
            activeCategory={activeCategory}
          />
        ))}
      </div>
    </details>
  );
}
