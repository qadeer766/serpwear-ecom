"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { zSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

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

const UpdatePassword = ({ email, otp }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= SCHEMA ================= */
  const formSchema = zSchema
    .pick({ email: true, password: true, otp: true }) // ✅ include otp
    .extend({
      confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
      otp: otp || "",
    },
  });

  /* ================= SYNC PROPS ================= */
  useEffect(() => {
    if (email) form.setValue("email", email);
    if (otp) form.setValue("otp", otp);
  }, [email, otp, form]);

  /* ================= SUBMIT ================= */
  const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true);

      const payload = {
        email: values.email,
        password: values.password,
        otp: values.otp, // ✅ send otp
      };

      const { data } = await axios.put(
        "/api/auth/reset-password/update-password",
        payload
      );

      if (!data.success) throw new Error(data.message);

      form.reset();
      showToast("success", data.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-bold">Update Password</h1>
        <p>Create a new password by filling the form below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
          {/* Hidden Fields */}
          <input type="hidden" {...form.register("email")} />
          <input type="hidden" {...form.register("otp")} />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>

                <button
                  type="button"
                  className="absolute right-3 top-9"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonLoading
            type="submit"
            text="Update Password"
            loading={loading}
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
};

export default UpdatePassword;