"use client";

import React from "react";
import AppSidebar from "@/components/Application/Admin/AppSidebar";
import TopBar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

const AdminLayout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
       <div className="flex min-h-screen w-full overflow-hidden">
  {/* Sidebar */}
  <AppSidebar />

  {/* Main Area */}
  <div className="flex flex-col flex-1 overflow-hidden">
    {/* Topbar */}
    <TopBar />

    {/* Content */}
    <main className="pt-16 md:px-8 px-5 pb-10 flex-1 overflow-x-hidden">
      {children}
    </main>

    {/* Footer */}
    <footer className="border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
      ©2026 Developer Qadeer™. All Rights Reserved.
    </footer>
  </div>
</div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;