"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useFetch from "@/hooks/useFetch";
import notFound from "@/public/assets/images/not-found.png";
import Image from "next/image";

import { statusBadge } from "@/lib/helperFunction";

const LatestOrder = () => {

  const [latestOrder, setLatestOrder] = useState([]);

  const { data, loading } =
    useFetch("/api/dashboard/admin/latest-order");

 useEffect(() => {

  if (!data) return;

  if (Array.isArray(data)) {
    setLatestOrder(data);
  }

  else if (data.success && Array.isArray(data.data)) {
    setLatestOrder(data.data);
  }

}, [data]);

  if (loading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  if (!latestOrder.length)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Image
          src={notFound}
          alt="not found"
          className="w-20"
        />
      </div>
    );

  return (

    <div className="overflow-auto max-h-[320px]">

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {latestOrder.map((order) => (

            <TableRow
              key={order._id}
              className="hover:bg-muted/40 transition"
            >

              <TableCell className="font-medium">
                {order.order_id}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {order.payment_id}
              </TableCell>

              <TableCell>
                {order.products?.length || 0}
              </TableCell>

              <TableCell>
                {statusBadge(order.status)}
              </TableCell>

              <TableCell className="text-right font-semibold">
                Rs {order.totalAmount?.toLocaleString()}
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
};

export default LatestOrder;