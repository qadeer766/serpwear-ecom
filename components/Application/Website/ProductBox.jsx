import React from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Image from "next/image";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";


const ProductBox = ({ product }) => {
  if (!product) return null;

  const imageUrl =
    product?.media?.[0]?.secure_url || imgPlaceholder.src;

  const productName = product?.name || "Product";

  const mrp = Number(product?.mrp || 0);
  const sellingPrice = Number(product?.sellingPrice || 0);

  const formatCurrency = (value) =>
    value.toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    });

  return (
    <div className="rounded-lg hover:shadow-lg border overflow-hidden transition duration-200 bg-white">
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        <div className="relative w-full lg:h-[300px] md:h-[200px] h-[150px]">
          <Image
            src={imageUrl}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            alt={productName}
            title={productName}
            className="object-cover object-top"
          />
        </div>

        <div className="p-3 border-t">
          <h4 className="font-medium line-clamp-2">
            {productName}
          </h4>

          <div className="flex gap-2 text-sm mt-2 items-center">
            {mrp > sellingPrice && (
              <span className="line-through text-gray-400">
                {formatCurrency(mrp)}
              </span>
            )}

            <span className="font-semibold text-primary">
              {formatCurrency(sellingPrice)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductBox;