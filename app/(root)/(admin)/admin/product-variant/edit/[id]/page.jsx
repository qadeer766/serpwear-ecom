

"use client";

import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";
import { sizes } from "@/lib/utils";
import { useParams } from "next/navigation";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
  { href: "", label: "Edit Product Variant" },
];

export default function EditProductVariant() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [variantLoading, setVariantLoading] = useState(true);

  /* Fetch products */
  const { data: productData } = useFetch("/api/product?deleteType=SD&size=1000");

  /* Fetch variant */
  const { data: variantData } = useFetch(`/api/product-variant/get/${id}`);

  useEffect(() => {
    if (Array.isArray(productData)) {
      setProductOptions(
        productData.map((prod) => ({
          label: prod.name,
          value: prod._id,
        }))
      );
    }
  }, [productData]);

  useEffect(() => {
    if (variantData) {
      form.reset({
        _id: variantData._id,
        sku: variantData.sku,
        product: variantData.product,
        color: variantData.color,
        size: variantData.size,
        mrp: variantData.mrp,
        sellingPrice: variantData.sellingPrice,
        discountPercentage: variantData.discountPercentage,
      });

      if (variantData.media?.length) {
        setSelectedMedia(
          variantData.media.map((m) => ({
            _id: m._id,
            secure_url: m.secure_url,
          }))
        );
      }
      setVariantLoading(false); // Stop loading once variant data is available
    }
  }, [variantData]);

  /* Validation schema */
  const formSchema = zSchema.pick({
    _id: true,
    sku: true,
    product: true,
    color: true,
    size: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      sku: "",
      product: "",
      color: "",
      size: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
    },
  });

  /* Auto Discount */
  const { watch, setValue } = form;
  const mrp = watch("mrp");
  const sellingPrice = watch("sellingPrice");

  useEffect(() => {
    const m = Number(mrp);
    const s = Number(sellingPrice);

    if (m > 0 && s > 0) {
      setValue("discountPercentage", Math.round(((m - s) / m) * 100));
    }
  }, [mrp, sellingPrice, setValue]);

  /* Submit */
  const onSubmit = async (values) => {
    try {
      if (!selectedMedia.length) {
        showToast("error", "Please select variant images.");
        return;
      }

      setLoading(true);

      values.media = selectedMedia.map((m) => m._id);

      const { data: res } = await axios.put(
        "/api/product-variant/update",
        values
      );

      if (!res.success) throw new Error(res.message);

      showToast("success", res.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="border-b py-2">
          <h4 className="font-semibold text-xl">Edit Product Variant</h4>
        </CardHeader>

        <CardContent className="pb-5">
          {variantLoading ? (
            <div className="text-center">Loading variant data...</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product */}
                  <FormField
                    name="product"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product *</FormLabel>
                        <FormControl>
                          <Select
                            options={productOptions}
                            selected={field.value}
                            setSelected={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SKU */}
                  <FormField
                    name="sku"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Color */}
                  <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Size */}
                  <FormField
                    name="size"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size *</FormLabel>
                        <FormControl>
                          <Select
                            options={sizes}
                            selected={field.value}
                            setSelected={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* MRP */}
                  <FormField
                    name="mrp"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selling Price */}
                  <FormField
                    name="sellingPrice"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount */}
                  <FormField
                    name="discountPercentage"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount %</FormLabel>
                        <FormControl>
                          <Input readOnly type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* MEDIA */}
                <div className="border border-dashed p-5 rounded text-center">
                  <MediaModal
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />

                  {selectedMedia.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {selectedMedia.map((m) => (
                        <div key={m._id} className="h-24 w-24 border">
                          <Image
                            src={m.secure_url || m.url}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                            alt="variant"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    onClick={() => setOpen(true)}
                    className="bg-gray-100 border w-[200px] mx-auto p-4 cursor-pointer font-semibold"
                  >
                    Select Media
                  </div>
                </div>

                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Save Changes"
                />
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}