"use client";

import React from "react";
import Image from "next/image";
import { RiMenu4Fill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import AdminSearch from "./AdminSearch";
import AdminMobileSearch from "./AdminMobileSearch";

import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 z-30 h-14 w-full border-b bg-white px-5 dark:bg-card md:pl-72 md:pr-8 shadow-sm">
      <div className="flex h-full items-center justify-between">
        
        {/* Mobile Logo */}
        <div className="flex items-center md:hidden">
          <Image
            src={logoBlack}
            alt="Logo"
            height={40}
            priority
            className="block h-[40px] w-auto dark:hidden"
          />
          <Image
            src={logoWhite}
            alt="Logo"
            height={40}
            priority
            className="hidden h-[40px] w-auto dark:block"
          />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block">
          <AdminSearch />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <AdminMobileSearch />
          <ThemeSwitch />
          <UserDropdown />

          {/* Sidebar Toggle */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="ml-2 md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <RiMenu4Fill className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;