import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const archiveData = [
  {
    month: "December",
    items: [
      { name: "Obsidian Chair", date: "DEC 12", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41" },
      { name: "Slate Lamp", date: "DEC 10", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c" },
      { name: "Carbon Desk", date: "DEC 05", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" },
      { name: "Ash Table", date: "DEC 01", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126" },
    ],
  },
  {
    month: "November",
    items: [
      { name: "Porcelain Vessel", date: "NOV 28", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6" },
      { name: "Acoustic Panel", date: "NOV 22", image: "/sidechair.png" },
      { name: "Matte Cutlery", date: "NOV 15", image: "https://images.unsplash.com/photo-1604909052743-94e838986d24" },
      { name: "Series IV Print", date: "NOV 02", image: "/paint.png" },
    ],
  },
  {
    month: "October",
    items: [
      { name: "Ergo Mesh", date: "OCT 29", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" },
      { name: "Analog Wall", date: "OCT 18", image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be" },
      { name: "Concrete Pot", date: "OCT 12", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6" },
      { name: "Industrial Shelf", date: "OCT 05", image: "shelf.png" },
    ],
  },
];

export default function Yearly() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* BREADCRUMB */}
      <p className="text-sm text-zinc-500 mb-4">
        Home / Timeline / <span className="text-zinc-900">2022 Archive</span>
      </p>

      {/* HEADER */}
      <h1 className="text-4xl md:text-5xl font-semibold text-zinc-900">
        Archive — 2022
      </h1>

      <p className="mt-4 max-w-3xl text-zinc-600 text-sm md:text-xl">
        A retrospective of the 48 products released in 2022. Exploring the
        intersection of minimalism and functional design through our monthly
        collections.
      </p>

      <div className="my-10 border-t border-zinc-200" />

      {/* MONTH SECTIONS */}
      {archiveData.map((section) => (
        <div key={section.month} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-5 w-1 bg-black rounded-full" />
            <h2 className="text-xl font-medium text-zinc-900">
              {section.month}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.items.map((item) => (
              <div key={item.name}>
                <div className="rounded-xl overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[280px] w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="mt-3 text-lg font-medium text-zinc-900">
                  {item.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* FOOTER NAV */}
      <div className="border-t border-zinc-200 pt-8 flex items-center justify-between">
        <button className="flex items-center gap-2 text-lg text-zinc-700 hover:text-black">
          <FiArrowLeft />
          <span>2021 Archive</span>
        </button>

        <button className="flex items-center gap-2 text-lg text-zinc-700 hover:text-black">
          <span>2023 Archive</span>
          <FiArrowRight />
        </button>
      </div>
    </section>
  );
}
