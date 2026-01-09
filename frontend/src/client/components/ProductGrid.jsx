import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProductCard from "./ProductCard";

const INITIAL_VISIBLE = 8;
const LOAD_MORE_COUNT = 4;

export default function ProductGrid({ products, activeCategory }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // 🔹 filter products
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const hasExpanded = visibleCount > INITIAL_VISIBLE;
  const canExpandMore = visibleCount < filteredProducts.length;

  return (
    <>
      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex justify-center gap-4">
        {/* EXPLORE MORE */}
        {canExpandMore && (
          <button
            onClick={() =>
              setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
            }
            className="group flex items-center gap-2 px-8 py-3 rounded-full border border-gray-400
                       hover:bg-black hover:text-white transition-all"
          >
            <span className="text-sm font-bold tracking-widest">
              EXPLORE MORE
            </span>
            <FaChevronDown className="transition-transform group-hover:translate-y-1" />
          </button>
        )}

        {/* SHOW LESS */}
        {hasExpanded && (
          <button
            onClick={() => setVisibleCount(INITIAL_VISIBLE)}
            className="group flex items-center gap-2 px-8 py-3 rounded-full border border-gray-400
                       hover:bg-gray-100 transition-all"
          >
            <span className="text-sm font-bold tracking-widest">
              SHOW LESS
            </span>
            <FaChevronUp className="transition-transform group-hover:-translate-y-1" />
          </button>
        )}
      </div>
    </>
  );
}
