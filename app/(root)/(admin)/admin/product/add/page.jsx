

"use client";

import { useEffect, useState } from "react";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoute";
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
  { href: "", label: "Add Product" },
];

export default function AddProduct() {
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CATEGORIES ================= */
  const { data: catRes } = useFetch("/api/category?deleteType=SD&size=1000");
  const [categoryOption, setCategoryOption] = useState([]);

  useEffect(() => {
   if (Array.isArray(catRes)) {
  setCategoryOption(
    catRes.map((cat) => ({
      label: cat.name,
      value: cat._id,
    }))
  );
}
  }, [catRes]);

  /* ================= MEDIA ================= */
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  /* ================= FORM SCHEMA ================= */
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    categoryId: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  /* ================= WATCH VALUES ================= */
  const name = form.watch("name");
  const mrp = form.watch("mrp");
  const sellingPrice = form.watch("sellingPrice");

  /* ================= AUTO SLUG ================= */
  useEffect(() => {
    if (name) {
      form.setValue("slug", slugify(name, { lower: true }));
    }
  }, [name, form]);

  /* ================= AUTO DISCOUNT ================= */
  useEffect(() => {
    const mrpNum = Number(mrp);
    const spNum = Number(sellingPrice);

    if (mrpNum > 0 && spNum > 0) {
      const discount = Math.round(((mrpNum - spNum) / mrpNum) * 100);
      form.setValue("discountPercentage", discount);
    }
  }, [mrp, sellingPrice, form]);

  /* ================= CKEDITOR ================= */
  const handleEditorChange = (_, editor) => {
    form.setValue("description", editor.getData());
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (values) => {
    try {
      if (selectedMedia.length === 0) {
        return showToast("error", "Please select at least one image.");
      }

      setLoading(true);

      const payload = {
        ...values,
        media: selectedMedia.map((m) => m._id),
      };

      const { data: res } = await axios.post("/api/product/create", payload);

      if (!res.success) {
        throw new Error(res.message);
      }

      showToast("success", res.message);

      // Reset the form and media
      form.reset();
      setSelectedMedia([]);
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="overflow-x-hidden w-full">
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="border-b py-2">
          <h4 className="font-semibold text-xl">Add Product</h4>
        </CardHeader>

        <CardContent className="pb-5 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ===== GRID ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Slug */}
                <FormField name="slug" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Category */}
                <FormField name="categoryId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Select
                        options={categoryOption}
                        selected={field.value}
                        setSelected={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* MRP */}
                <FormField name="mrp" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>MRP *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Selling Price */}
                <FormField name="sellingPrice" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Discount */}
                <FormField name="discountPercentage" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount %</FormLabel>
                    <FormControl>
                      <Input readOnly type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              {/* ===== DESCRIPTION ===== */}
              <div>
                <FormLabel>Description *</FormLabel>
                <Editor onChange={handleEditorChange} />

                {/* Hidden field for form registration */}
                <FormField name="description" control={form.control} render={({ field }) => (
                  <input type="hidden" {...field} />
                )} />
              </div>

              {/* ===== MEDIA ===== */}
              <div className="border border-dashed rounded p-5">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedMedia.map((m) => (
                      <div key={m._id} className="h-20 w-20 border rounded overflow-hidden">
                        <Image
                          src={m.secure_url || m.url}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 border w-[180px] mx-auto p-3 cursor-pointer text-center font-semibold"
                >
                  Select Media
                </div>
              </div>

              {/* ===== SUBMIT ===== */}
              <ButtonLoading loading={loading} type="submit" text="Add Product" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}