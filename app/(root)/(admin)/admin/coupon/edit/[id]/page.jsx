"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import React, { useEffect, useState } from "react";
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
import dayjs from "dayjs";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Edit Coupon" },
];

const EditCoupon = ({ params }) => {
  const id = params.id;

  const [loading, setLoading] = useState(false);

  const { data: getCouponData } = useFetch(`/api/coupon/get/${id}`);

  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "",
    },
  });

  // ✅ Populate form when data arrives
  useEffect(() => {
    if (getCouponData?.success) {
      const coupon = getCouponData.data;

      form.reset({
        _id: coupon._id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        minShoppingAmount: coupon.minShoppingAmount,
        validity: dayjs(coupon.validity).format("YYYY-MM-DD"),
      });
    }
  }, [getCouponData, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        discountPercentage: Number(values.discountPercentage),
        minShoppingAmount: Number(values.minShoppingAmount),
        validity: new Date(values.validity),
      };

      const { data: response } = await axios.put(
        `/api/coupon/update`,
        payload
      );

      if (!response.success) throw new Error(response.message);

      showToast("success", response.message);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <h4 className="font-semibold">Edit Coupon</h4>
        </CardHeader>

        <CardContent className="pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid md:grid-cols-2 gap-5"
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="COUPON50" {...field} />
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
                    <FormLabel>Discount % *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="minShoppingAmount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Shopping Amount *</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="validity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                loading={loading}
                type="submit"
                text="Save Changes"
                className="md:col-span-2"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;