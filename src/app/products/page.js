import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Handmade Clay Mug",
    price: "$28",
    image: "/mug.webp",
    description: "A warm earthy-toned ceramic mug perfect for your morning coffee."
  },
  {
    id: 2,
    name: "Woven Wall Hanging",
    price: "$45",
    image: "/wall-hanging.jpg",
    description: "Neutral-toned macrame art to cozy up any room."
  },
  {
    id: 3,
    name: "Wooden Spoon Set",
    price: "$18",
    image: "/spoons.jpg",
    description: "Hand-carved wooden kitchen utensils, sustainably sourced."
  },
];

export default function ProductListingPage() {
  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <h1 className="text-3xl font-serif text-center text-[#8d6e63] mb-10">
        Featured Handmade Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md border border-[#d7ccc8] p-4 flex flex-col"
          >
            <div className="relative w-full h-52 mb-4 rounded overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-xl font-serif text-[#8d6e63]">{product.name}</h2>
            <p className="text-sm text-[#444] mt-1 mb-2">{product.description}</p>
            <span className="mt-auto text-lg font-semibold text-[#8d6e63]">
              {product.price}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
