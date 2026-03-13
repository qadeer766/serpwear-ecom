"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoStar } from "react-icons/io5";
import ButtonLoading from "../ButtonLoading";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import ReviewList from "./ReviewList";
import { zSchema } from "@/lib/zodSchema";
import { Input } from "@/components/ui/input";

const ProductReview = ({ productId }) => {
  const queryClient = useQueryClient();
  const auth = useSelector((store) => store.authStore.auth);

  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  /* ---------------- REVIEW SUMMARY ---------------- */

  const { data: reviewSummary } = useQuery({
    queryKey: ["review-summary", productId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/review/details?productId=${productId}`
      );
      return data?.data;
    },
  });

  /* ---------------- FORM ---------------- */

  const formSchema = zSchema.pick({
    product: true,
    userId: true,
    rating: true,
    title: true,
    review: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: productId,
      userId: auth?._id || "",
      rating: 0,
      title: "",
      review: "",
    },
  });

  useEffect(() => {
    if (auth?._id) {
      form.setValue("userId", auth._id);
    }
  }, [auth, form]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleReviewSubmit = async (values) => {
    try {
      setLoading(true);

      const { data: response } = await axios.post(
        "/api/review/create",
        values
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset({
        product: productId,
        userId: auth?._id || "",
        rating: 0,
        title: "",
        review: "",
      });

      showToast("success", response.message);

      queryClient.invalidateQueries(["product-reviews", productId]);
      queryClient.invalidateQueries(["review-summary", productId]);

      setShowReviewForm(false);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REVIEW LIST (INFINITE) ---------------- */

  const fetchReviews = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `/api/review/get?productId=${productId}&page=${pageParam}`
    );
    return data?.data;
  };

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["product-reviews", productId],
    queryFn: fetchReviews,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="shadow rounded border mb-20">
      <div className="p-3 bg-gray-50 border-b">
        <h2 className="font-semibold">Rating & Reviews</h2>
      </div>

      <div className="p-3">
        <div className="flex justify-between flex-wrap items-center">
          {/* LEFT SIDE SUMMARY */}
          <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
            <div className="md:w-[200px] w-full md:mb-0 mb-5">
              <h4 className="text-center text-8xl font-semibold">
                {reviewSummary?.averageRating || 0}
              </h4>

              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar key={i} />
                ))}
              </div>

              <p className="text-center mt-3">
                ({reviewSummary?.totalReview || 0} Ratings & Reviews)
              </p>
            </div>

            <div className="md:w-[calc(100%-200px)] flex items-center">
              <div className="w-full">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <p className="w-3">{rating}</p>
                      <IoStar />
                    </div>
                    <Progress
                      value={
                        reviewSummary?.percentage?.[rating] || 0
                      }
                    />
                    <span className="text-sm">
                      {reviewSummary?.rating?.[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <div className="md:w-1/2 w-full md:text-end text-center">
            <Button
              onClick={() =>
                setShowReviewForm((prev) => !prev)
              }
              variant="outline"
              type="button"
              className="md:w-fit w-full py-6 px-10"
            >
              Write Review
            </Button>
          </div>
        </div>

        {/* REVIEW FORM */}
        {showReviewForm && (
          <div className="my-5">
            <hr className="mb-5" />
            <h4 className="text-xl font-semibold mb-3">
              Write a Review
            </h4>

            {!auth ? (
              <>
                <p className="mb-2">
                  Login to submit review.
                </p>
                <Button asChild>
                  <Link
                    href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}
                  >
                    Login
                  </Link>
                </Button>
              </>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    handleReviewSubmit
                  )}
                  className="space-y-4"
                >
                  <FormField
                    name="rating"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Rating
                            value={field.value}
                            onChange={(_, value) =>
                              field.onChange(value)
                            }
                            size="large"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Review title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="review"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your comment here..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Submit Review"
                  />
                </form>
              </Form>
            )}
          </div>
        )}

        {/* REVIEW LIST */}
        <div className="mt-10 border-t pt-5">
          <h5 className="text-xl font-semibold">
            {reviewSummary?.totalReview || 0} Reviews
          </h5>

          <div className="mt-10">
            {data?.pages?.map((page) =>
              page?.reviews?.map((review) => (
                <div
                  className="mb-5"
                  key={review._id}
                >
                  <ReviewList review={review} />
                </div>
              ))
            )}

            {hasNextPage && (
              <ButtonLoading
                text="Load More"
                type="button"
                loading={isFetching}
                onClick={fetchNextPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;