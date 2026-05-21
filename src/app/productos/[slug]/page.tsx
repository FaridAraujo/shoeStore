import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import ProductDetail from "@/components/sections/ProductDetail";
import { getProductBySlug } from "@/lib/products";

/*
  /productos/[slug] — individual product page.

  The slug is resolved to a real catalog product (getProductBySlug falls
  back to the first product — ASICS Gel-1130 — if the slug is unknown),
  and the product object is passed straight into ProductDetail.

  CartProvider lives in the root layout — no need to repeat it here.
*/

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  return {
    title: `${product.brand} ${product.name}`,
    description: product.description,
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  return (
    <>
      <Nav />
      <ProductDetail product={product} />
    </>
  );
}
