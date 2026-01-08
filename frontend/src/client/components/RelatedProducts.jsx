import { FiHeart } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    id: 1,
    title: "Side Chair Wood Base",
    price: "$895.00",
    image:
      "/sidechair.png",
  },
  {
    id: 2,
    title: "Three Seat Sofa",
    price: "$2,450.00",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=800",
  },
  {
    id: 3,
    title: "Noguchi Table",
    price: "$1,295.00",
    image:
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=800",
  },
];

export default function RelatedProducts() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            Related Products
          </h2>
          <p className="text-sm text-zinc-500">
            Curated items that complete the look.
          </p>
        </div>

        <button className="text-sm font-medium text-zinc-900 hover:underline">
          View Collection →
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="border-none shadow-none group"
          >
            <CardContent className="p-0">
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-xl bg-zinc-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-[360px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* WISHLIST ICON */}
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-zinc-100 transition">
                  <FiHeart className="h-4 w-4 text-zinc-700" />
                </button>
              </div>

              {/* DETAILS */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-zinc-900">
                  {product.title}
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  {product.price}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
