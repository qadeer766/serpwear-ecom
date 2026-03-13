"use client";

import Image from "next/image";
import React from "react";
import usericon from "@/public/assets/images/user.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoStar } from "react-icons/io5";

dayjs.extend(relativeTime);

const ReviewList = ({ review }) => {
  return (
    <div className="flex gap-5">
      {/* Avatar */}
      <div className="w-[60px]">
        <Image
          src={review?.avatar?.url || usericon}
          width={55}
          height={55}
          alt="user avatar"
          className="rounded-lg object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-xl font-semibold">
          {review?.title}
        </h4>

        <p className="flex flex-wrap gap-2 items-center text-sm mt-1">
          <span className="font-medium">
            {review?.reviewedBy || "Anonymous"}
          </span>

          <span className="text-gray-500">
            • {review?.createdAt
              ? dayjs(review.createdAt).fromNow()
              : ""}
          </span>

          <span className="flex items-center gap-1 text-xs">
            ({review?.rating || 0}
            <IoStar className="text-yellow-500" />)
          </span>
        </p>

        <p className="mt-3 text-gray-600 whitespace-pre-line">
          {review?.review}
        </p>
      </div>
    </div>
  );
};

export default ReviewList;