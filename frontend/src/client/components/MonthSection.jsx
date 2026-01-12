import ProductGrid from "./ProductGrid";

export default function MonthSection({ month, activeCategory }) {
  return (
    <section className="mb-20 pl-4 border-l border-gray-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">{month.name}</h3>
        <p className="text-sm text-gray-400">{month.tagline}</p>
      </div>

      <ProductGrid
        products={month.products}
        activeCategory={activeCategory}
      />
    </section>
  );
}
