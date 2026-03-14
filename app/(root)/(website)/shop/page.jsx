"use client";

import React, { useState } from "react";


import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSize";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import ButtonLoading from "@/components/Application/ButtonLoading";

import Filter from "@/components/Application/Website/Filter";
import Sorting from "@/components/Application/Website/Sorting";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
import ProductBox from "@/components/Application/Website/ProductBox";

const breadcrumb = {
  title: "shop",
  links: [{ label: "shop", href: WEBSITE_SHOP }],
};

const Shop = () => {
  const searchParams = useSearchParams().toString();
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMobileFilter, setIsMobileFilter] = useState(false);
  const windowSize = useWindowSize();

  /* ================= FETCH PRODUCTS ================= */
  const fetchProduct = async (pageParam = 1) => {
    const { data } = await axios.get(
      `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data.data; // { products, nextPage }
  };

  /* ================= INFINITE QUERY ================= */
  const {
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", limit, sorting, searchParams],
    queryFn: ({ pageParam }) => fetchProduct(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      <section className="lg:flex lg:px-32 px-4 my-20 gap-6">

  {/* FILTER (LEFT SIDE DESKTOP) */}
  <div className="hidden lg:block w-72">
    <div className="sticky top-0 bg-gray-50 p-4 rounded">
      <Filter />
    </div>
  </div>

  {/* PRODUCT AREA */}
  <div className="flex-1">
    <Sorting
      limit={limit}
      setLimit={setLimit}
      sorting={sorting}
      setSorting={setSorting}
      mobileFilterOpen={isMobileFilter}
      setMobileFilterOpen={setIsMobileFilter}
    />

    {isFetching && (
      <div className="p-3 font-semibold text-center">
        Loading...
      </div>
    )}

    {error && (
      <div className="p-3 font-semibold text-center text-red-500">
        {error.message}
      </div>
    )}

    <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-10">
      {data?.pages?.map((page) =>
        page?.products?.map((product) => (
          <ProductBox key={product._id} product={product} />
        ))
      )}
    </div>

    <div className="mt-10 text-center">
      {hasNextPage ? (
        <ButtonLoading
          type="button"
          loading={isFetching}
          text="Load More"
          onClick={() => fetchNextPage()}
        />
      ) : (
        !isFetching && <span>No more data to load.</span>
      )}
    </div>
  </div>
</section>
    </div>
  );
};

export default Shop;