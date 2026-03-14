"use client";

import ButtonLoading from "@/components/Application/ButtonLoading";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

import { addIntoCart } from "@/store/reducer/cartReducer";

import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { FaShippingFast } from "react-icons/fa";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const breadCrumb = {
  title: "Checkout",
  links: [{ label: "Checkout" }],
};

const CheckOutPage = () => {
  const dispatch = useDispatch();

  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);

  const [verifiedCartData, setVerifiedCartData] = useState([]);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [placingOrder, setPlacingOrder] = useState(false);

  /* ---------------- CART VERIFICATION ---------------- */

  const { data: verifiedCart } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products }
  );

  useEffect(() => {
    if (verifiedCart?.success) {
      const cartData = verifiedCart.data;

      setVerifiedCartData(cartData);

      cartData.forEach((item) => dispatch(addIntoCart(item)));
    }
  }, [verifiedCart]);

  /* ---------------- PRICE CALCULATION ---------------- */

  useEffect(() => {
    const cartProducts = cart.products || [];

    const subTotalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0
    );

    const totalDiscount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0
    );

    setSubtotal(subTotalAmount);
    setDiscount(totalDiscount);
    setTotalAmount(subTotalAmount);
  }, [cart]);

  /* ---------------- ORDER FORM ---------------- */

  const orderFormSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernot: true,
    })
    .extend({
      userId: zSchema.shape.userId.optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernot: "",
      userId: auth?.user?._id,
    },
  });

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = async (formData) => {
  setPlacingOrder(true);

  try {

     localStorage.setItem(
      "shippingData",
      JSON.stringify(formData)
    );
    localStorage.setItem(
  "cartProducts",
  JSON.stringify(cart.products)



);

    const { data } = await axios.post(
      "/api/payment/create-checkout-session",
      {
        amount: totalAmount,
      }
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    window.location.href = data.data.checkoutUrl;

  } catch (error) {
    showToast("error", error.message);
  } finally {
    setPlacingOrder(false);
  }
};

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />

      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center">
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
          
          {/* SHIPPING FORM */}

          <div className="lg:w-[60%] w-full">
            <div className="flex font-semibold gap-2 items-center">
              <FaShippingFast size={25} />
              Shipping Address
            </div>

            <div className="mt-5">
              <Form {...orderForm}>
                <form
                  className="grid grid-cols-2 gap-5"
                  onSubmit={orderForm.handleSubmit(placeOrder)}
                >
                  {[
                    ["name", "Full Name*"],
                    ["email", "Email Address*"],
                    ["phone", "Phone Number*"],
                    ["country", "Country*"],
                    ["state", "State*"],
                    ["city", "City*"],
                    ["pincode", "Pin Code*"],
                    ["landmark", "Landmark*"],
                  ].map(([fieldName, placeholder]) => (
                    <FormField
                      key={fieldName}
                      control={orderForm.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder={placeholder} {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="col-span-2">
                    <FormField
                      control={orderForm.control}
                      name="ordernot"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Order Note"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <ButtonLoading
                      type="submit"
                      loading={placingOrder}
                      text="Pay with Stripe"
                      className="bg-black rounded-full px-5"
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">

              <h4 className="text-lg font-semibold mb-5">
                Order Summary
              </h4>

              <table>
                <tbody>
                  {verifiedCartData?.map((product) => (
                    <tr key={product.variantId}>
                      <td className="p-3">
                        <div className="flex items-center gap-5">
                          <Image
                            src={product.media}
                            width={60}
                            height={60}
                            alt={product.name}
                          />

                          <div>
                            <h4 className="font-medium">
                              <Link
                                href={WEBSITE_PRODUCT_DETAILS(product.url)}
                              >
                                {product.name}
                              </Link>
                            </h4>

                            <p className="text-sm">
                              Color: {product.color}
                            </p>

                            <p className="text-sm">
                              Size: {product.size}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {product.qty} × Rs {product.sellingPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr className="my-3" />

              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {subtotal}</span>
                </p>

                <p className="flex justify-between">
                  <span>Discount</span>
                  <span>- Rs {discount}</span>
                </p>

                <p className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rs {totalAmount}</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CheckOutPage;