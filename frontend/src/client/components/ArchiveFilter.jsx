const categories = ["All", "Furniture", "Lighting", "Decor", "Office"];

export default function ArchiveFilter({ active, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${
              active === cat
                ? "bg-black text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
