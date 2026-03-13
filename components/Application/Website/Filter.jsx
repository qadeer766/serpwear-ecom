"use client";

import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ButtonLoading from "../ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [priceFilter, setPriceFilter] = useState({
    minPrice: 0,
    maxPrice: 3000,
  });

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorData } = useFetch("/api/product-variant/colors");
  const { data: sizeData } = useFetch("/api/product-variant/sizes");

  const urlSearchParams = new URLSearchParams(searchParams.toString());

  /* ================= SYNC FROM URL ================= */
  useEffect(() => {
    setSelectedCategory(
      searchParams.get("category")
        ? searchParams.get("category").split(",")
        : []
    );

    setSelectedColor(
      searchParams.get("color")
        ? searchParams.get("color").split(",")
        : []
    );

    setSelectedSize(
      searchParams.get("size")
        ? searchParams.get("size").split(",")
        : []
    );
  }, [searchParams]);

  /* ================= CATEGORY ================= */
  const handleCategoryFilter = (slug) => {
    let updated = [...selectedCategory];

    if (updated.includes(slug)) {
      updated = updated.filter((item) => item !== slug);
    } else {
      updated.push(slug);
    }

    setSelectedCategory(updated);

    updated.length
      ? urlSearchParams.set("category", updated.join(","))
      : urlSearchParams.delete("category");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  /* ================= COLOR ================= */
  const handleColorFilter = (color) => {
    let updated = [...selectedColor];

    if (updated.includes(color)) {
      updated = updated.filter((item) => item !== color);
    } else {
      updated.push(color);
    }

    setSelectedColor(updated);

    updated.length
      ? urlSearchParams.set("color", updated.join(","))
      : urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  /* ================= SIZE ================= */
  const handleSizeFilter = (size) => {
    let updated = [...selectedSize];

    if (updated.includes(size)) {
      updated = updated.filter((item) => item !== size);
    } else {
      updated.push(size);
    }

    setSelectedSize(updated);

    updated.length
      ? urlSearchParams.set("size", updated.join(","))
      : urlSearchParams.delete("size");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  /* ================= PRICE ================= */
  const handlePriceChange = (value) => {
    setPriceFilter({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handlePriceFilter = () => {
    urlSearchParams.set("minPrice", priceFilter.minPrice);
    urlSearchParams.set("maxPrice", priceFilter.maxPrice);
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  return (
    <div>
      {searchParams.size > 0 && (
        <Button type="button" variant="destructive" className="w-full" asChild>
          <Link href={WEBSITE_SHOP}>Clear Filter</Link>
        </Button>
      )}

      <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
        {/* CATEGORY */}
        <AccordionItem value="1">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            {categoryData?.map((category) => (
  <div key={category._id} className="mb-2">
    <label className="flex items-center space-x-2 cursor-pointer">
      <Checkbox
        checked={selectedCategory.includes(category.slug)}
        onCheckedChange={() => handleCategoryFilter(category.slug)}
      />
      <span>{category.name}</span>
    </label>
  </div>
))}
          </AccordionContent>
        </AccordionItem>

        {/* COLOR */}
        <AccordionItem value="2">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            {colorData?.map((color) => (
  <div key={color} className="mb-2">
    <label className="flex items-center space-x-2 cursor-pointer">
      <Checkbox
        checked={selectedColor.includes(color)}
        onCheckedChange={() => handleColorFilter(color)}
      />
      <span>{color}</span>
    </label>
  </div>
))}
          </AccordionContent>
        </AccordionItem>

        {/* SIZE */}
        <AccordionItem value="3">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
           {sizeData?.map((size) => (
  <div key={size} className="mb-2">
    <label className="flex items-center space-x-2 cursor-pointer">
      <Checkbox
        checked={selectedSize.includes(size)}
        onCheckedChange={() => handleSizeFilter(size)}
      />
      <span>{size}</span>
    </label>
  </div>
))}
          </AccordionContent>
        </AccordionItem>

        {/* PRICE */}
        <AccordionItem value="4">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <Slider
              defaultValue={[0, 3000]}
              max={3000}
              step={1}
              onValueChange={handlePriceChange}
            />

            <div className="flex justify-between mt-2">
              <span>{priceFilter.minPrice}</span>
              <span>{priceFilter.maxPrice}</span>
            </div>

            <div className="mt-4">
              <ButtonLoading
                type="button"
                text="Filter Price"
                onClick={handlePriceFilter}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;