"use client";

import React, { useState, useEffect } from "react";
import { BsCart2 } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";

import { removeFromCart } from "@/store/reducer/cartReducer";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/showToast";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((store) => store.cartStore);
  const dispatch = useDispatch();

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative">
        <BsCart2 size={25} className="text-gray-500 hover:text-primary" />

        <span className="absolute bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center -right-2 -top-1">
          {cart.count}
        </span>
      </SheetTrigger>

      <SheetContent className="sm:max-w-[450px] w-full">

        <SheetHeader className="py-2">
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100vh-40px)] pb-10">

          {/* Products */}
          <div className="h-[calc(100%-128px)] overflow-auto px-2">

            {cart.count === 0 ? (
              <div className="h-full flex justify-center items-center text-xl font-semibold">
                Your Cart Is Empty.
              </div>
            ) : (
              cart.products?.map((product) => (
                <div
                  key={product.variantId}
                  className="flex justify-between items-center gap-5 mb-4 border-b pb-4"
                >
                  <div className="flex gap-5 items-center">

                    <Image
                      src={product?.media || imgPlaceholder}
                      height={100}
                      width={100}
                      alt={product.name}
                      className="w-20 h-20 rounded border"
                    />

                    <div>
                      <h4 className="text-lg mb-1">{product.name}</h4>

                      <p className="text-gray-500">
                        {product.size} / {product.color}
                      </p>
                    </div>

                  </div>

                  <div className="text-right">

                    <button
                      className="text-red-500 underline cursor-pointer"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: product.productId,
                            variantId: product.variantId,
                          })
                        )
                      }
                    >
                      Remove
                    </button>

                    <p className="font-semibold">
                      {product.qty} x Rs. {product.sellingPrice}
                    </p>

                  </div>
                </div>
              ))
            )}

          </div>

          {/* Bottom Section */}
          <div className="h-32 border-t pt-5 px-2">

            <h2 className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </h2>

            <h2 className="flex justify-between text-lg font-semibold">
              <span>Discount</span>
              <span>-Rs. {discount}</span>
            </h2>

            <div className="flex justify-between gap-5 mt-3">

              <Button
                asChild
                variant="secondary"
                className="w-[200px]"
                onClick={() => setOpen(false)}
              >
                <Link href={WEBSITE_CART}>View Cart</Link>
              </Button>

              {cart.count ? (
                <Button
                  asChild
                  className="w-[200px]"
                  onClick={() => setOpen(false)}
                >
                  <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-[200px]"
                  onClick={() => showToast("error", "Your cart is empty!")}
                >
                  Checkout
                </Button>
              )}

            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;