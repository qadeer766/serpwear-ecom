"use client";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";

const breadCrumbData = {
  title: "Orders",
  links: [{ label: "Orders" }],
};

const Orders = () => {
  const { data: orderData, loading } = useFetch("/api/user-order");

  const orders = orderData || [];

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border">Orders</div>

          <div className="p-5">
            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Sr.No.
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Order id
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Total Item
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-5 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}

                  {orders.map((order, i) => (
                    <tr key={order._id}>
                      <td className="text-start text-sm text-gray-500 p-2 font-bold">
                        {i + 1}
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        <Link
                          className="underline hover:text-blue-500 underline-offset-2"
                          href={WEBSITE_ORDER_DETAILS(order.order_id)}
                        >
                          {order.order_id}
                        </Link>
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        {order.products?.length || 0}
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        {order.totalAmount?.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Orders;