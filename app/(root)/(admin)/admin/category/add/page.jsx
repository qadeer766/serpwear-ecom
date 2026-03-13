


"use client";

import React, { useEffect, useState } from "react";
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
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { useRouter } from "next/navigation";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { label: "Add Category" },
];

const AddCategory = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // ✅ Proper slug auto-generation
  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue) {
      form.setValue(
        "slug",
        slugify(nameValue, { lower: true, strict: true })
      );
    }
  }, [nameValue, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      // Ensure that the slug is valid before sending it to the backend
      if (!values.slug) {
        values.slug = slugify(values.name, { lower: true, strict: true });
      }

      const { data: response } = await axios.post(
        "/api/category/create",
        values
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
      router.push(ADMIN_CATEGORY_SHOW);

    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="py-0 mt-4 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="text-xl font-semibold">Add Category</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto generated slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                text="Add Category"
                type="submit"
                loading={loading}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;