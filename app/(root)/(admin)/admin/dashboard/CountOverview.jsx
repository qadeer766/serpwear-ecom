"use client";

import Link from "next/link";
import React from "react";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import useFetch from "@/hooks/useFetch";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_CUSTOMERS_SHOW,
  ADMIN_ORDER_SHOW,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanelRoute";

const CountOverview = () => {
 const { data: countData, loading, error } = useFetch(
  "/api/dashboard/admin/count"
);

const counts = countData || {};

  const cards = [
    {
      title: "Total Categories",
      count: counts.category ?? 0,
      icon: <BiCategory size={24} />,
      color: "bg-green-500",
      link: ADMIN_CATEGORY_SHOW,
      border: "border-l-green-500",
    },
    {
      title: "Total Products",
      count: counts.product ?? 0,
      icon: <IoShirtOutline size={24} />,
      color: "bg-blue-500",
      link: ADMIN_PRODUCT_SHOW,
      border: "border-l-blue-500",
    },
    {
      title: "Total Customers",
      count: counts.customer ?? 0,
      icon: <LuUserRound size={24} />,
      color: "bg-yellow-500",
      link: ADMIN_CUSTOMERS_SHOW,
      border: "border-l-yellow-500",
    },
    {
      title: "Total Orders",
      count: counts.order ?? 0,
      icon: <MdOutlineShoppingBag size={24} />,
      color: "bg-cyan-500",
      link: ADMIN_ORDER_SHOW,
      border: "border-l-cyan-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((item, index) => (
        <Link key={index} href={item.link}>
          <div
            className={`group cursor-pointer p-5 rounded-xl border shadow-sm bg-white dark:bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 ${item.border}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                {/* Count Section */}
                <p className="text-3xl font-bold mt-1">
                  {loading ? (
                    <span className="animate-pulse text-gray-300">---</span>
                  ) : error ? (
                    0
                  ) : (
                    item.count.toLocaleString()
                  )}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all duration-300 group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountOverview;