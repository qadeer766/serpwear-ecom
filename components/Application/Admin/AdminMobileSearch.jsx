"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import SearchModel from "./SearchModel";

const AdminMobileSearch = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleOpen}
        className="md:hidden"
        aria-label="Open search"
      >
        <IoIosSearch className="h-5 w-5" />
      </Button>

      <SearchModel open={open} setOpen={setOpen} />
    </>
  );
};

export default AdminMobileSearch;