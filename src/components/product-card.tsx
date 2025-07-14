export function ProductCard({ product }: { product: any }) {
  return <div>{product?.name || "Produto"}</div>;
}
