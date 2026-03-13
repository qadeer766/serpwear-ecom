"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const UploadMedia = ({ isMultiple = true, queryClient }) => {
  const [uploading, setUploading] = useState(false);

  const handleOnError = (error) => {
    showToast("error", error?.message || "Upload failed");
  };

  const handleOnQueuesEnd = async (result) => {
    try {
      setUploading(true);

      const files = result?.info?.files || [];

      const uploadedFiles = files
        .filter((file) => file?.uploadInfo)
        .map((file) => ({
          asset_id: file.uploadInfo.asset_id,
          public_id: file.uploadInfo.public_id,
          secure_url: file.uploadInfo.secure_url,
          url: file.uploadInfo.url,
          width: file.uploadInfo.width,
          height: file.uploadInfo.height,
          format: file.uploadInfo.format,
          resource_type: file.uploadInfo.resource_type,
        }));

      if (uploadedFiles.length === 0) return;

      const { data } = await axios.post(
        "/api/media/create",
        uploadedFiles
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      // React Query v5 syntax
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["media-data"] });
      }

      showToast("success", data.message || "Media uploaded successfully");
    } catch (error) {
      showToast("error", error?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      onError={handleOnError}
      onQueuesEnd={handleOnQueuesEnd}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "unsplash", "google_drive"],
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          className="mt-4 flex items-center gap-2"
          onClick={() => open()}
          disabled={uploading}
        >
          <FiPlus />
          {uploading ? "Uploading..." : "Upload Media"}
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;