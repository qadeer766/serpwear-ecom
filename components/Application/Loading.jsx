import React from "react";
import Image from "next/image";
import loading from "@/public/assets/images/loading.svg";

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Image
        src={loading}
        alt="Loading..."
        width={80}
        height={80}
        priority
      />
    </div>
  );
};

export default Loading;