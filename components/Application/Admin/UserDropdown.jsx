"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ADMIN_PRODUCT_ADD } from "@/routes/AdminPanelRoute";
import adminLogo from "@/public/assets/images/admin-logo.png";
import LogoutButton from "./LogoutButton";

const UserDropdown = () => {
  const auth = useSelector((store) => store.authStore.auth);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={adminLogo.src} alt="Admin Avatar" />
          <AvatarFallback>
            {auth?.name?.charAt(0)?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <p className="font-semibold">
            {auth?.name || "Admin"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href={ADMIN_PRODUCT_ADD}
            className="flex items-center gap-2"
          >
            <IoShirtOutline />
            New Product
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="#"
            className="flex items-center gap-2"
          >
            <MdOutlineShoppingBag />
            Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;