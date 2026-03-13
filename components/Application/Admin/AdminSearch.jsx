"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import SearchModel from "./SearchModel";

const AdminSearch = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  return (
    <div className="md:w-[350px]">
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleOpen();
          }
        }}
        className="relative flex cursor-pointer items-center"
        aria-label="Open admin search"
      >
        <Input
          readOnly
          placeholder="Search..."
          className="cursor-pointer rounded-full pr-10 focus-visible:ring-2"
        />

        <IoIosSearch
          size={18}
          className="absolute right-3 text-muted-foreground"
        />
      </div>

      <SearchModel open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminSearch;