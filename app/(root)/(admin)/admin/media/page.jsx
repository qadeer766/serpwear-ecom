"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import Media from "@/components/Application/Admin/Media";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import ButtonLoading from "@/components/Application/ButtonLoading";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import useDeleteMutation from "@/hooks/useDeleteMutation";
import {
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
} from "@/routes/AdminPanelRoute";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Media" },
];

const MediaPage = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ------------------------------
  // Detect Trash Mode
  // ------------------------------
  useEffect(() => {
    const trashOf = searchParams.get("trashof");
    setDeleteType(trashOf ? "PD" : "SD");
    setSelectedMedia([]);
    setSelectAll(false);
  }, [searchParams]);

  // ------------------------------
  // Fetch Media
  // ------------------------------
  const fetchMedia = async (pageParam, deleteType) => {
    const { data } = await axios.get(
      `/api/media?page=${pageParam}&limit=10&deleteType=${deleteType}`
    );
    return data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: ({ pageParam }) => fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages.length : undefined,
  });

  // ------------------------------
  // All IDs (Safe)
  // ------------------------------
  const allIds = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(
      (page) => page?.mediaData?.map((m) => m._id) || []
    );
  }, [data]);

  // ------------------------------
  // Select All Logic
  // ------------------------------
  useEffect(() => {
    if (selectAll) {
      setSelectedMedia(allIds);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll, allIds]);

  // ------------------------------
  // Delete Mutation
  // ------------------------------
  const deleteMutation = useDeleteMutation(
    "media-data",
    "/api/media/delete"
  );

  const handleDelete = (ids, type) => {
    let confirmAction = true;

    if (type === "PD") {
      confirmAction = confirm(
        "Are you sure you want to delete permanently?"
      );
    }

    if (confirmAction) {
      deleteMutation.mutate({ ids, deleteType: type });
      setSelectedMedia([]);
      setSelectAll(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="py-0 mt-4 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Media Trash"}
            </h4>

            <div className="flex items-center gap-5">
              {deleteType === "SD" && (
                <UploadMedia isMultiple queryClient={queryClient} />
              )}

              {deleteType === "SD" ? (
                <Button variant="destructive" asChild>
                  <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                    Trash
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={ADMIN_MEDIA_SHOW}>
                    Back To Media
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-5">
          {/* Bulk Action Bar */}
          {allIds.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 rounded flex justify-between items-center mb-4">
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={() => setSelectAll(!selectAll)}
                />
                Select All
              </Label>

              {selectedMedia.length > 0 && (
                <div className="flex gap-2">
                  {deleteType === "SD" ? (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleDelete(selectedMedia, "SD")
                      }
                    >
                      Move To Trash
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() =>
                          handleDelete(selectedMedia, "RSD")
                        }
                      >
                        Restore
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleDelete(selectedMedia, "PD")
                        }
                      >
                        Delete Permanently
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">
              {error?.message}
            </div>
          ) : allIds.length === 0 ? (
            <div>Data not found.</div>
          ) : (
            <>
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media) => (
                      <Media
                        key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {hasNextPage && (
                <ButtonLoading
                  type="button"
                  loading={isFetching}
                  onClick={() => fetchNextPage()}
                  text="Load More"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;