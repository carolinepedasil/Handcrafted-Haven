import products from "@/data/products.json";

export async function getAllProducts() {
  return products;
}

export async function getProductById(id) {
  const all = await getAllProducts();
  const target = String(id);
  return all.find((p) => String(p.id) === target) || null;
}
