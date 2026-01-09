import YearAccordion from "./YearAccordion";

export default function ArchiveCollapsible({ data }) {
  return (
    <div className="flex flex-col">
      {data.map((year) => (
        <YearAccordion key={year.year} yearData={year} />
      ))}
    </div>
  );
}
