"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
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

import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { showToast } from "@/lib/showToast";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_MEDIA_SHOW, label: "Media" },
  { href: "", label: "Edit Media" },
];

const EditMedia = ({ params }) => {
  const { id } = params;

  const { data: mediaData } = useFetch(`/api/media/get/${id}`);
  const [loading, setLoading] = useState(false);

  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  // ---------------------------
  // Populate Form
  // ---------------------------
  useEffect(() => {
    if (mediaData && mediaData.success) {
      const data = mediaData.data;

      form.reset({
        _id: data._id,
        alt: data.alt || "",
        title: data.title || "",
      });
    }
  }, [mediaData, form]);

  // ---------------------------
  // Submit
  // ---------------------------
  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await axios.put("/api/media/update", values);

      if (!data.success) {
        throw new Error(data.message || "Media update failed");
      }

      showToast("success", data.message);
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

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="py-0 mt-4 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="text-xl font-semibold">Edit Media</h4>
        </CardHeader>

        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Image Preview */}
              <div className="mb-5">
                <Image
                  src={
                    mediaData?.data?.secure_url ||
                    imgPlaceholder.src
                  }
                  width={150}
                  height={150}
                  alt={mediaData?.data?.title || "Image"}
                  className="rounded border"
                />
              </div>

              {/* ALT */}
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Alt</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Alt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                text="Update Media"
                type="submit"
                className="cursor-pointer"
                loading={loading}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMedia;