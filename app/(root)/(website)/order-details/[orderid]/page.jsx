"use client";

import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import axios from "axios";

import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";

const breadCrumb = {
  title: "Order Details",
  links: [{ label: "Order Details" }],
};

const OrderDetailsPage = () => {
  const { orderid } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const { data } = await axios.get(`/api/order/get/${orderid}`);

        if (!data.success) {
          throw new Error(data.message);
        }

        setOrder(data.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderid) {
      getOrder();
    }
  }, [orderid]);

  if (loading) {
    return (
      <div className="w-screen h-[400px] flex justify-center items-center">
        <h2 className="text-xl font-semibold">Loading Order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-screen h-[400px] flex justify-center items-center">
        <h2 className="text-xl font-semibold">Order not found.</h2>
      </div>
    );
  }

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />

      <div className="lg:px-32 px-4 my-20">

        {/* Order Header */}

        <div className="mb-10 border rounded p-5">

          <h2 className="text-2xl font-semibold mb-2">
            Order #{order._id}
          </h2>

          <p>Status: <span className="font-semibold">{order.status}</span></p>

          <p>Total Amount: <span className="font-semibold">Rs {order.totalAmount}</span></p>

        </div>

        {/* Products */}

        <div className="border rounded mb-10">

          <div className="border-b p-4 font-semibold">
            Ordered Products
          </div>

          <div>

            {order.products.map((product) => (

              <div
                key={product.variantId?._id}
                className="flex items-center justify-between p-4 border-b"
              >

                <div className="flex items-center gap-4">

                  <Image
                    src={imgPlaceholder}
                    width={70}
                    height={70}
                    alt={product.name}
                    className="rounded border"
                  />

                  <div>

                    <h4 className="font-medium">

                      <Link href={WEBSITE_PRODUCT_DETAILS(product.url || "")}>
                        {product.name}
                      </Link>

                    </h4>

                    <p className="text-sm">
                      Qty: {product.qty}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold">
                    Rs {product.sellingPrice}
                  </p>

                  <p className="text-sm">
                    Total: Rs {product.sellingPrice * product.qty}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Shipping Address */}

        <div className="border rounded p-5 mb-10">

          <h3 className="font-semibold mb-3">
            Shipping Address
          </h3>

          <p>{order.name}</p>
          <p>{order.email}</p>
          <p>{order.phone}</p>

          <p>
            {order.address1}, {order.address2}
          </p>

          <p>
            {order.city}, {order.state}
          </p>

          <p>
            {order.country}
          </p>

        </div>

        {/* Price Summary */}

        <div className="border rounded p-5">

          <h3 className="font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2">

            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs {order.subtotal}</span>
            </p>

            <p className="flex justify-between">
              <span>Discount</span>
              <span>- Rs {order.discount}</span>
            </p>

            <p className="flex justify-between">
              <span>Coupon Discount</span>
              <span>- Rs {order.couponDiscount}</span>
            </p>

            <p className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>Rs {order.totalAmount}</span>
            </p>

          </div>

          <div className="mt-6">

            <Link
              href={WEBSITE_SHOP}
              className="underline text-sm"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;