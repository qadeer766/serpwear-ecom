


"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Link from "next/link";
import Image from "next/image";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { IoStar } from "react-icons/io5";
import { decode, encode } from "entities";
import { HiMinus, HiPlus } from "react-icons/hi2";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import loadingSvg from "@/public/assets/images/loading.svg";
import ProductReview from "@/components/Application/Website/ProductReview";

const ProductDetails = ({
  product,
  variant,
  colors = [],
  sizes = [],
  reviewCount = 0,
}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);

  const [activeThumb, setActiveThumb] = useState("");
  const [qty, setQty] = useState(1);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);

  /* ---------------- IMAGE FALLBACK LOGIC ---------------- */

  const mediaSource =
    variant?.media?.length > 0
      ? variant.media
      : product?.media || [];

  useEffect(() => {
    if (mediaSource.length > 0) {
      setActiveThumb(mediaSource[0]?.secure_url || imgPlaceholder);
    } else {
      setActiveThumb(imgPlaceholder);
    }
  }, [variant, product]);

  const handleThumb = (thumbUrl) => {
    setActiveThumb(thumbUrl);
  };

  /* ---------------- CART CHECK ---------------- */

  useEffect(() => {
    if (!variant?._id || !cartStore?.products) return;

    const existingProduct = cartStore.products.find(
      (cartProduct) =>
        cartProduct.productId === product._id &&
        cartProduct.variantId === variant._id
    );

    setIsAddedIntoCart(!!existingProduct);
    setIsProductLoading(false);
  }, [variant, cartStore, product]);

  const handleQty = (type) => {
    if (type === "inc") {
      setQty((prev) => prev + 1);
    } else if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: activeThumb,
      qty,
    };

    dispatch(addIntoCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast("success", "Product added to cart!");
  };

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

  return (
    <div className="lg:px-32 px-4">
      {isProductLoading && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
          <Image src={loadingSvg} width={80} height={80} alt="Loading" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="my-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>
                Product
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
                  {product?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* MAIN SECTION */}
      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">

        {/* IMAGE SECTION */}
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">

          {/* Main Image */}
          <div className="xl:order-last xl:w-[calc(100%-144px)]">
            <Image
              src={activeThumb || imgPlaceholder}
              width={650}
              height={650}
              alt="product"
              className="border rounded max-w-full"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex xl:flex-col gap-3 xl:w-36 overflow-auto max-h-[600px]">
            {mediaSource.map((thumb) => (
              <Image
                key={thumb._id}
                src={thumb?.secure_url || imgPlaceholder}
                width={100}
                height={100}
                alt="thumbnail"
                className={`rounded cursor-pointer ${
                  thumb.secure_url === activeThumb
                    ? "border-2 border-primary"
                    : "border"
                }`}
                onClick={() => handleThumb(thumb.secure_url)}
              />
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="md:w-1/2">

          <h1 className="text-3xl font-semibold mb-2">
            {product?.name}
          </h1>

          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} />
            ))}
            <span className="text-sm ps-2">
              ({reviewCount} Reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-semibold">
              {formatCurrency(variant?.sellingPrice)}
            </span>
            <span className="text-sm line-through text-gray-500">
              {formatCurrency(variant?.mrp)}
            </span>
            <span className="bg-red-500 px-3 py-1 text-white text-xs rounded-2xl">
              -{variant?.discountPercentage}%
            </span>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: decode(product?.description || ""),
            }}
          />

          {/* Colors */}
<div className="mt-5">
  <p className="mb-2">
    <span className="font-semibold">Color:</span> {variant?.color}
  </p>

  <div className="flex gap-3 flex-wrap">
    {colors.map((clr) => (
      <Link
        key={clr}
        onClick={() => setIsProductLoading(true)}
        href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${clr}&size=${variant.size}`}
        className={`border px-4 py-2 rounded-lg transition ${
          clr === variant.color
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white"
        }`}
      >
        {clr}
      </Link>
    ))}
  </div>
</div>

{/* Sizes */}
<div className="mt-5">
  <p className="mb-2">
    <span className="font-semibold">Size:</span> {variant?.size}
  </p>

  <div className="flex gap-3 flex-wrap">
    {sizes.map((sz) => (
      <Link
        key={sz}
        onClick={() => setIsProductLoading(true)}
        href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${sz}`}
        className={`border px-4 py-2 rounded-lg transition ${
          sz === variant.size
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white"
        }`}
      >
        {sz}
      </Link>
    ))}
  </div>
</div>

          {/* Quantity */}
        
<div className="mt-5">
  <p className="font-semibold mb-2">Quantity</p>

  <div className="flex items-center h-10 border rounded-full w-fit">
    
    {/* Decrease */}
    <button
      type="button"
      onClick={() => handleQty("dec")}
      className="h-full w-10 flex items-center justify-center"
    >
      <HiMinus />
    </button>

    {/* Input */}
    <input
      type="text"
      value={qty}
      readOnly
      className="w-12 text-center border-none outline-none"
    />

    {/* Increase */}
    <button
      type="button"
      onClick={() => handleQty("inc")}
      className="h-full w-10 flex items-center justify-center"
    >
      <HiPlus />
    </button>

  </div>
</div>

          {/* Cart */}
          <div className="mt-5">
            {!isAddedIntoCart ? (
              <ButtonLoading
                type="button"
                text="Add To Cart"
                className="w-full rounded-full py-6"
                onClick={handleAddToCart}
              />
            ) : (
              <Button asChild className="w-full rounded-full py-6">
                <Link href={WEBSITE_CART}>Go to Cart</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10 border rounded shadow">
        <div className="p-3 bg-gray-50 border-b">
          <h2 className="font-semibold">Product Description</h2>
        </div>
        <div className="p-3">
          <div
            dangerouslySetInnerHTML={{
              __html: encode(product?.description || ""),
            }}
          />
        </div>
      </div>

      {/* Reviews */}
      <ProductReview productId={product._id} />
    </div>
  );
};

export default ProductDetails;