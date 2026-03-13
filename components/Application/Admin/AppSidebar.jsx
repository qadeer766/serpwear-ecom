"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";

import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = (url) => pathname === url;

  return (
    <Sidebar className="z-50">
      {/* HEADER */}
      <SidebarHeader className="h-14 border-b p-0">
        <div className="flex items-center justify-between px-4">
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

          <Button
            onClick={toggleSidebar}
            type="button"
            size="icon"
            variant="ghost"
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu) => {
            const hasSubmenu = menu.submenu?.length > 0;
            const activeParent =
              isActive(menu.url) ||
              menu.submenu?.some((sub) => isActive(sub.url));

            return (
              <SidebarMenuItem key={menu.title}>
                {hasSubmenu ? (
                  <Collapsible defaultOpen={activeParent} className="group">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`px-2 py-4 font-semibold ${
                          activeParent ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex w-full items-center gap-2">
                          <menu.icon />
                          {menu.title}
                          <LuChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.submenu.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuButton
                              asChild
                              className={`px-2 py-3 ${
                                isActive(sub.url) ? "bg-muted" : ""
                              }`}
                            >
                              <Link href={sub.url}>{sub.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : menu.url ? (
  <SidebarMenuButton
    asChild
    className={`px-2 py-4 font-semibold ${
      isActive(menu.url) ? "bg-muted" : ""
    }`}
  >
    <Link href={menu.url} className="flex items-center gap-2">
      <menu.icon />
      {menu.title}
    </Link>
  </SidebarMenuButton>
) : (
  <SidebarMenuButton className="px-2 py-4 font-semibold">
    <div className="flex items-center gap-2">
      <menu.icon />
      {menu.title}
    </div>
  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;