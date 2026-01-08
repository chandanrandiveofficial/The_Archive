export default function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${
            product.disabled ? "grayscale opacity-60" : ""
          }`}
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </div>

      <div className="mt-3">
        <p className="font-semibold text-sm">{product.title}</p>
        <p className="text-xs text-gray-400 uppercase">{product.date}</p>
      </div>
    </div>
  );
}
