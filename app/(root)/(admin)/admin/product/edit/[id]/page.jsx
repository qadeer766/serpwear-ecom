
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  { href: "", label: "Edit Product" },
];

export default function EditProduct() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  /* ================= FORM SCHEMA ================= */

  const formSchema = zSchema.pick({
    _id: true,
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
      _id: id,
      name: "",
      slug: "",
      categoryId: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  /* ================= FETCH DATA ================= */

  const { data: categoryRes } = useFetch(
    "/api/category?deleteType=SD&size=1000"
  );

  const { data: productRes } = useFetch(
    id ? `/api/product/get/${id}` : null
  );

  /* ================= LOAD CATEGORY ================= */

  useEffect(() => {
    if (categoryRes?.data) {
      setCategoryOption(
        categoryRes.data.map((cat) => ({
          label: cat.name,
          value: cat._id,
        }))
      );
    }
  }, [categoryRes]);

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {
    if (productRes?.data) {
      const p = productRes.data;

      form.reset({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        discountPercentage: p.discountPercentage,
        description: p.description,
      });

      if (p.media?.length) {
        setSelectedMedia(
          p.media.map((m) => ({
            _id: m._id,
            secure_url: m.secure_url,
          }))
        );
      }
    }
  }, [productRes, form]);

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
    const m = Number(mrp);
    const s = Number(sellingPrice);

    if (m > 0 && s > 0) {
      form.setValue(
        "discountPercentage",
        Math.round(((m - s) / m) * 100)
      );
    }
  }, [mrp, sellingPrice, form]);

  /* ================= CKEDITOR ================= */

  const handleEditorChange = (_, editor) => {
    form.setValue("description", editor.getData());
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (values) => {
    try {
      if (!selectedMedia.length) {
        return showToast("error", "Please select product images.");
      }

      setLoading(true);

      const payload = {
        ...values,
        media: selectedMedia.map((m) => m._id),
      };

      const { data: res } = await axios.put(
        "/api/product/update",
        payload
      );

      if (!res.success) throw new Error(res.message);

      showToast("success", res.message);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="overflow-x-hidden">
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="border-b py-2">
          <h4 className="font-semibold text-xl">
            Edit Product
          </h4>
        </CardHeader>

        <CardContent className="pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="categoryId"
                  control={form.control}
                  render={({ field }) => (
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
                  )}
                />

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

              <div>
                <FormLabel>Description *</FormLabel>
                <Editor
                  onChange={handleEditorChange}
                  initialData={form.getValues("description")}
                />
              </div>

              <ButtonLoading
                loading={loading}
                type="submit"
                text="Save Changes"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}