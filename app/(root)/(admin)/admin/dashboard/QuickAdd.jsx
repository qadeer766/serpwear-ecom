"use client";

import {
  ADMIN_CATEGORY_ADD,
  ADMIN_COUPON_ADD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_ADD,
} from "@/routes/AdminPanelRoute";

import Link from "next/link";
import React from "react";
import { BiCategory, BiImage } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { RiCoupon2Line } from "react-icons/ri";

const quickActions = [
  {
    title: "Add Category",
    href: ADMIN_CATEGORY_ADD,
    icon: BiCategory,
    gradient:
      "from-green-400 via-green-500 to-green-600",
  },
  {
    title: "Add Product",
    href: ADMIN_PRODUCT_ADD,
    icon: IoShirtOutline,
    gradient:
      "from-blue-400 via-blue-500 to-blue-600",
  },
  {
    title: "Add Coupon",
    href: ADMIN_COUPON_ADD,
    icon: RiCoupon2Line,
    gradient:
      "from-yellow-400 via-yellow-500 to-yellow-600",
  },
  {
    title: "Upload Media",
    href: ADMIN_MEDIA_SHOW,
    icon: BiImage,
    gradient:
      "from-cyan-400 via-cyan-500 to-cyan-600",
  },
];

const QuickAdd = () => {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
      {quickActions.map((item, index) => {
        const Icon = item.icon;

        return (
          <Link
            key={index}
            href={item.href}
            className={`group flex items-center justify-between p-4 rounded-xl shadow-sm 
            bg-gradient-to-tr ${item.gradient} 
            transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
          >
            <h4 className="font-medium text-white text-sm sm:text-base">
              {item.title}
            </h4>

            <span
              className="w-12 h-12 flex justify-center items-center rounded-full 
              bg-white/20 text-white 
              transition-all duration-300 group-hover:bg-white/30"
            >
              <Icon size={20} />
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickAdd;