"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanelRoute";
import { showToast } from "@/lib/showToast";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { LuTrash } from "react-icons/lu";

const Media = ({
  media,
  handleData,
  deleteType,
  selectedMedia = [],
  setSelectedMedia,
}) => {
  const isSelected =
    Array.isArray(selectedMedia) &&
    selectedMedia.includes(media._id);

  const handleCheck = (e) => {
    e?.stopPropagation?.();

    setSelectedMedia((prev) => {
      if (prev.includes(media._id)) {
        return prev.filter((id) => id !== media._id);
      }
      return [...prev, media._id];
    });
  };

  const handleCopyLink = async (url) => {
    try {
      if (!navigator?.clipboard) {
        return showToast("error", "Clipboard not supported");
      }

      await navigator.clipboard.writeText(url);
      showToast("success", "Link copied.");
    } catch {
      showToast("error", "Failed to copy link");
    }
  };

  const handleDelete = () => {
    if (typeof handleData === "function") {
      handleData([media._id], deleteType);
    }
  };

  return (
    <div className="relative overflow-hidden rounded border border-gray-200 dark:border-gray-800 group">
      
      {/* Checkbox */}
      <div
        className="absolute left-2 top-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheck}
          className="cursor-pointer border-primary"
        />
      </div>

      {/* Dropdown */}
      <div className="absolute right-2 top-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50"
              aria-label="Media actions"
            >
              <BsThreeDotsVertical color="#fff" size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={ADMIN_MEDIA_EDIT(media._id)}
                    className="flex items-center gap-2"
                  >
                    <MdOutlineEdit />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleCopyLink(media.secure_url)}
                  className="flex items-center gap-2"
                >
                  <IoIosLink />
                  Copy Link
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-500"
            >
              <LuTrash />
              {deleteType === "SD"
                ? "Move to Trash"
                : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 z-10 bg-black/0 transition-all duration-150 group-hover:bg-black/30"></div>

      {/* Image */}
      <Image
        src={media?.secure_url}
        alt={media?.alt || "Media image"}
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, 300px"
        className="h-[150px] w-full object-cover sm:h-[200px]"
      />
    </div>
  );
};

export default Media;