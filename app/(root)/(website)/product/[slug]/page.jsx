import axios from "axios";
import ProductDetails from "./ProductDetails";

const ProductPage = async ({ params, searchParams }) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams?.slug;
  const color = resolvedSearchParams?.color;
  const size = resolvedSearchParams?.size;

  if (!slug) {
    return <div>Product not found</div>;
  }

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  if (color && size) {
    url += `?color=${color}&size=${size}`;
  }

  try {
    const { data } = await axios.get(url);

    if (!data?.success) {
      return <div>Data not found</div>;
    }

    return (
      <ProductDetails
        product={data.data.product}
        variant={data.data.variant}
        colors={data.data.colors || []}
        sizes={data.data.sizes || []}
        reviewCount={data.data.reviewCount || 0}
      />
    );
  } catch (error) {
    return <div>Something went wrong</div>;
  }
};

export default ProductPage;