



"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import slugify from "slugify";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";

const EditCategory = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Fetch existing category data by ID
  const { data: categoryData } = useFetch(`/api/category/get/${id}`);

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
    },
  });

  // Set form values when data arrives
  useEffect(() => {
    if (categoryData?.success) {
      const data = categoryData.data;

      form.reset({
        _id: data._id,
        name: data.name,
        slug: data.slug,
      });
    }
  }, [categoryData, form]);

  // Slug auto-update (only if slug is not manually modified)
  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (nameValue && !slugValue) { // Only auto-generate slug if not manually set
      form.setValue(
        "slug",
        slugify(nameValue, { lower: true, strict: true })
      );
    }
  }, [nameValue, slugValue, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        "/api/category/update",
        values
      );

      if (!data.success) throw new Error(data.message || "Category update failed");

      showToast("success", data.message);

      router.push(ADMIN_CATEGORY_SHOW);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { label: "Edit Category" },
  ];

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="border-b py-2">
          <h4 className="font-semibold">Edit Category</h4>
        </CardHeader>

        <CardContent className="pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="slug"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Auto slug"
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
                text="Update Category"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;