"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoStar } from "react-icons/io5";

import Image from "next/image";

import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import notFound from "@/public/assets/images/not-found.png";

import useFetch from "@/hooks/useFetch";

const LatestReview = () => {

  const [latestReview, setLatestReview] = useState([]);

  const { data: getLatestReview, loading } =
    useFetch("/api/dashboard/admin/latest-review");

  useEffect(() => {

  if (Array.isArray(getLatestReview)) {

    const validReviews = getLatestReview.filter(
      (r) => r.productId
    );

    setLatestReview(validReviews);

  }

}, [getLatestReview]);

  console.log("Latest Review API:", getLatestReview);

  if (loading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  if (!latestReview.length)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Image src={notFound} alt="not found" className="w-20" />
      </div>
    );

  return (

    <div className="overflow-auto max-h-[320px]">

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {latestReview.map((item) => {

            const productImage =
              item.productId?.media?.[0]?.secure_url ||
              imgPlaceholder.src;

            return (

              <TableRow key={item._id}>

                <TableCell className="font-medium">
                  {item.productId?.name || "Unknown Product"}
                </TableCell>

                <TableCell className="flex items-center gap-3 max-w-[250px]">

                  <Avatar className="h-8 w-8 shrink-0">

                    <AvatarImage
                      src={productImage}
                      alt={item.productId?.name}
                    />

                    <AvatarFallback>
                      {(item.productId?.name || "PR")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>

                  </Avatar>

                  <span className="truncate text-sm text-muted-foreground">
                    {item.review}
                  </span>

                </TableCell>

                <TableCell>

                  <div className="flex items-center gap-1">

                    {Array.from({ length: 5 }).map((_, i) => (

                      <IoStar
                        key={i}
                        className={
                          i < item.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                        size={16}
                      />

                    ))}

                  </div>

                </TableCell>

              </TableRow>

            );

          })}

        </TableBody>

      </Table>

    </div>

  );
};

export default LatestReview;