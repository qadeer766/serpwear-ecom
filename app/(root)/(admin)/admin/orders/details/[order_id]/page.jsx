"use client";

import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";

import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import ButtonLoading from "@/components/Application/ButtonLoading";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";

import { showToast } from "@/lib/showToast";
import axios from "axios";


const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Unverified", value: "unverified" },
];

const OrderDetailsPage = () => {
  const { order_id } = useParams();

  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { data, loading } = useFetch(
    order_id ? `/api/order/get/${order_id}` : null
  );

  const order = data ?? null;

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleOrderStatus = async () => {
    if (!order?._id) return;

    setUpdatingStatus(true);

    try {
      const { data: response } = await axios.put("/api/order/update-status", {
        _id: order._id,
        status: status,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
     <h1 className="font-bold">Order Details</h1>

      <div className="px-4 my-20">

        {/* Order Header */}
        <div className="mb-10 border rounded p-5">
          <h2 className="text-2xl font-semibold mb-2">
            Order #{order._id}
          </h2>

          <p>
            Status: <span className="font-semibold">{order.status}</span>
          </p>

          <p>
            Total Amount:
            <span className="font-semibold"> Rs {order.totalAmount}</span>
          </p>
        </div>

        {/* Products */}
        <div className="border rounded mb-10">
          <div className="border-b p-4 font-semibold">
            Ordered Products
          </div>

          {(order.products ?? []).map((product) => {
            const productData = product.productId;

            return (
              <div
                key={product.variantId?._id || product._id}
                className="flex items-center justify-between p-4 border-b"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={imgPlaceholder}
                    width={70}
                    height={70}
                    alt={productData?.name || "Product"}
                    className="rounded border"
                  />

                  <div>
                    <h4 className="font-medium">
                      <Link
                        href={WEBSITE_PRODUCT_DETAILS(
                          productData?.slug || ""
                        )}
                      >
                        {productData?.name || "Product"}
                      </Link>
                    </h4>

                    <p className="text-sm">Qty: {product.qty}</p>
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
            );
          })}
        </div>

        {/* Shipping Address */}
        <div className="border rounded p-5 mb-10">
          <h3 className="font-semibold mb-3">Shipping Address</h3>

          <p>{order.name}</p>
          <p>{order.email}</p>
          <p>{order.phone}</p>

          <p>
            {order.address1}, {order.address2}
          </p>

          <p>
            {order.city}, {order.state}
          </p>

          <p>{order.country}</p>
        </div>

        {/* Order Summary */}
        <div className="border rounded p-5">
          <h3 className="font-semibold mb-4">Order Summary</h3>

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

          <hr className="my-4" />

          {/* Status Update */}
          <h4 className="text-lg font-semibold mb-2">
            Order Status
          </h4>

          <Select
            options={statusOptions}
            selected={status}
            setSelected={setStatus}
            placeholder="Select"
            isMulti={false}
          />

          <ButtonLoading
            loading={updatingStatus}
            text="Save Status"
            type="button"
            onClick={handleOrderStatus}
            className="mt-5 cursor-pointer"
          />

         
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;