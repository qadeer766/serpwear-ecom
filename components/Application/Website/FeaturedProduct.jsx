import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import ProductBox from "./ProductBox";

const FeaturedProduct = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/product/get-featured-product`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch featured products");
    }

    const productData = await res.json();

    if (!productData?.success || !productData?.data?.length) {
      return null;
    }

    return (
      <section className="lg:px-32 px-4 sm:py-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="sm:text-4xl text-2xl font-semibold">
            Featured Products
          </h2>

          <Link
            href="/shop"
            className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
          >
            View All <IoIosArrowForward />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
          {productData.data.map((product) => (
            <ProductBox key={product._id} product={product} />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Featured product fetch error:", error);
    return null;
  }
};

export default FeaturedProduct;