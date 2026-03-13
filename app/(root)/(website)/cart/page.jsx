"use client";

import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/store/reducer/cartReducer";

const breadCrumb = {
  title: "Cart",
  links: [{ label: "cart" }],
};

const CartPage = () => {
  const dispatch = useDispatch();

  const cart = useSelector((store) => store.cartStore);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  /* ---------------- CART CALCULATION ---------------- */

  useEffect(() => {
    const cartProducts = cart.products || [];

    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0
    );

    const totalDiscount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0
    );

    setSubtotal(totalAmount);
    setDiscount(totalDiscount);
  }, [cart]);

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />

      {/* EMPTY CART */}
      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center py-32">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">
              Your cart is empty.
            </h4>

            <Button asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">

          {/* CART TABLE */}
          <div className="lg:w-[70%] w-full">

            <table className="w-full border">

              <thead className="border-b bg-gray-50 md:table-header-group hidden">
                <tr>
                  <th className="text-center p-3">Product</th>
                  <th className="text-center p-3">Price</th>
                  <th className="text-center p-3">Quantity</th>
                  <th className="text-center p-3">Total</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>

              <tbody>

                {cart.products.map((product) => (
                  <tr
                    key={product.variantId}
                    className="md:table-row block border-b"
                  >
                    {/* PRODUCT */}
                    <td className="p-3">
                      <div className="flex items-center gap-5">

                        <Image
                          src={product.media || imgPlaceholder}
                          width={60}
                          height={60}
                          alt={product.name}
                          className="rounded"
                        />

                        <div>
                          <h4 className="text-lg font-medium line-clamp-1">
                            <Link
                              href={WEBSITE_PRODUCT_DETAILS(product.url)}
                            >
                              {product.name}
                            </Link>
                          </h4>

                          <p>Color: {product.color}</p>
                          <p>Size: {product.size}</p>
                        </div>

                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">

                      <span className="md:hidden font-medium">
                        Price
                      </span>

                      <span>
                        Rs. {product.sellingPrice}
                      </span>

                    </td>

                    {/* QUANTITY */}
                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2">

                      <span className="md:hidden font-medium">
                        Quantity
                      </span>

                      <div className="flex justify-center">

                        <div className="flex items-center h-10 border rounded-full">

                          {/* MINUS */}
                          <button
                            type="button"
                            className="h-full w-10 flex justify-center items-center"
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  productId: product.productId,
                                  variantId: product.variantId,
                                })
                              )
                            }
                          >
                            <HiMinus />
                          </button>

                          <input
                            type="text"
                            value={product.qty}
                            readOnly
                            className="w-14 text-center border-none"
                          />

                          {/* PLUS */}
                          <button
                            type="button"
                            className="h-full w-10 flex justify-center items-center"
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  productId: product.productId,
                                  variantId: product.variantId,
                                })
                              )
                            }
                          >
                            <HiPlus />
                          </button>

                        </div>
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">

                      <span className="md:hidden font-medium">
                        Total
                      </span>

                      <span>
                        Rs. {product.sellingPrice * product.qty}
                      </span>

                    </td>

                    {/* REMOVE */}
                    <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">

                      <span className="md:hidden font-medium">
                        Remove
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: product.productId,
                              variantId: product.variantId,
                            })
                          )
                        }
                        className="text-red-500 text-xl"
                      >
                        <IoCloseCircleOutline />
                      </button>

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:w-[30%] w-full">

            <div className="rounded bg-gray-50 p-5 sticky top-5">

              <h4 className="text-lg font-semibold mb-5">
                Order Summary
              </h4>

              <table className="w-full">

                <tbody>

                  <tr>
                    <td className="font-medium py-2">
                      Subtotal
                    </td>

                    <td className="text-right py-2">
                      Rs. {subtotal}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium py-2">
                      Discount
                    </td>

                    <td className="text-right py-2">
                      - Rs. {discount}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium py-2">
                      Total
                    </td>

                    <td className="text-right py-2">
                      Rs. {subtotal}
                    </td>
                  </tr>

                </tbody>

              </table>

              <Button
                asChild
                className="w-full bg-black rounded mt-5 mb-3"
              >
                <Link href={WEBSITE_CHECKOUT}>
                  Proceed to Checkout
                </Link>
              </Button>

              <p className="text-center">
                <Link
                  href={WEBSITE_SHOP}
                  className="hover:underline"
                >
                  Continue Shopping
                </Link>
              </p>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;