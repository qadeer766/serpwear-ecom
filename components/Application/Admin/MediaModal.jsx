"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import loading from "@/public/assets/images/loading.svg";
import ModalMediaBlock from "./ModalMediaBlock";
import ButtonLoading from "../ButtonLoading";
import { showToast } from "@/lib/showToast";

const MediaModal = ({
  open,
  setOpen,
  selectedMedia = [],
  setSelectedMedia,
  isMultiple = false,
}) => {
  const [previouslySelected, setPreviouslySelected] = useState([]);

  // Sync previous selection when modal opens
  useEffect(() => {
    if (open) {
      setPreviouslySelected(selectedMedia || []);
    }
  }, [open]);

  const fetchMedia = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `/api/media?page=${pageParam}&limit=18&deleteType=SD`
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  };

  const {
    isPending,
    isError,
    error,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["MediaModal"],
    queryFn: fetchMedia,
    initialPageParam: 1,
   getNextPageParam: (lastPage, allPages) =>
  lastPage?.hasMore ? allPages.length + 1 : undefined,
  });

  const handleClear = () => {
    setSelectedMedia([]);
    showToast("success", "Media selection cleared");
  };

  const handleClose = () => {
    setSelectedMedia(previouslySelected);
    setOpen(false);
  };

  const handleSelect = () => {
    if (!selectedMedia.length) {
      return showToast("error", "Please select a media.");
    }

    setPreviouslySelected(selectedMedia);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[90%] h-[90vh] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogDescription className="hidden" />

        <div className="flex h-full flex-col bg-white dark:bg-card rounded">
          <DialogHeader className="border-b p-4">
            <DialogTitle>Media Selection</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {isPending ? (
              <div className="flex h-full items-center justify-center">
                <Image src={loading} alt="loading" width={80} height={80} />
              </div>
            ) : isError ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-red-500">
                  {error?.message || "Something went wrong"}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
                  {data?.pages?.flatMap((page) =>
                    (page?.mediaData || []).map((media) => (
                      <ModalMediaBlock
                        key={media._id}
                        media={media}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                        isMultiple={isMultiple}
                      />
                    ))
                  )}
                </div>

                {hasNextPage && (
                  <div className="flex justify-center py-6">
                    <ButtonLoading
                      type="button"
                      onClick={() => fetchNextPage()}
                      loading={isFetchingNextPage}
                      text="Load More"
                    />
                  </div>
                )}

                {!hasNextPage && (
                  <p className="py-6 text-center text-muted-foreground">
                    Nothing more to load.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex justify-between border-t p-4">
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleSelect}>Select</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;