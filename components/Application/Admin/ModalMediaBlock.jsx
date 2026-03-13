"use client";

import React from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const ModalMediaBlock = ({
  media,
  selectedMedia = [],
  setSelectedMedia,
  isMultiple = true,
}) => {
  const isSelected =
    Array.isArray(selectedMedia) &&
    selectedMedia.some((m) => m._id === media._id);

  const handleCheck = (e) => {
    e?.stopPropagation?.();

    if (isMultiple) {
      if (isSelected) {
        setSelectedMedia((prev) =>
          prev.filter((m) => m._id !== media._id)
        );
      } else {
        setSelectedMedia((prev) => [
          ...prev,
          { _id: media._id, url: media.secure_url },
        ]);
      }
    } else {
      setSelectedMedia([
        { _id: media._id, url: media.secure_url },
      ]);
    }
  };

  return (
    <div
      onClick={handleCheck}
      className={`
        relative cursor-pointer overflow-hidden rounded border
        border-gray-200 transition-all dark:border-gray-800
        ring-1 ${isSelected ? "ring-primary" : "ring-transparent"}
        group
      `}
      aria-pressed={isSelected}
    >
      {/* Checkbox */}
      <div
        className="absolute left-2 top-2 z-20 rounded bg-white/80 p-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheck}
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"></div>

      {/* Image */}
      <Image
        src={media.secure_url}
        alt={media.alt || "Media image"}
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, 300px"
        className="h-[100px] w-full object-cover md:h-[150px]"
      />
    </div>
  );
};

export default ModalMediaBlock;