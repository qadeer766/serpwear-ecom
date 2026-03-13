"use client";

import React, { useState, useEffect } from "react";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import ButtonLoading from "./ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { showToast } from "@/lib/showToast";

const OtpVerification = ({ email, onSubmit, loading }) => {
  const [isResendOtp, setIsResendOtp] = useState(false);

  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email || "",
    },
  });

  // ✅ Sync email if prop changes
  useEffect(() => {
    form.setValue("email", email || "");
  }, [email, form]);

  // ✅ Submit OTP
  const handleOtpVerification = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      showToast("error", error?.message || "Verification failed");
    }
  };

  // ✅ Resend OTP
  const resendOTP = async () => {
    if (!email) return;

    try {
      setIsResendOtp(true);

      const { data } = await axios.post("/api/auth/resend-otp", { email });

      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);

      form.reset({
        otp: "",
        email,
      });
    } catch (error) {
      showToast("error", error?.message || "Something went wrong");
    } finally {
      setIsResendOtp(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="mb-5 text-center">
            <h1 className="mb-2 text-2xl font-bold">
              Please complete verification
            </h1>
            <p className="text-md">
              We have sent a one-time password (OTP) to your registered email.
              The OTP is valid for 10 minutes.
            </p>
          </div>

          <div className="mb-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    One-time Password (OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="size-10 text-xl"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ButtonLoading
            text="Verify"
            type="submit"
            className="w-full"
            loading={loading}
          />

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={resendOTP}
              disabled={isResendOtp}
              className="text-blue-500 hover:underline disabled:opacity-50"
            >
              {isResendOtp ? "Resending…" : "Resend OTP"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;