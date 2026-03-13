"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/assets/images/logo-black.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";
import OtpVerification from "@/components/Application/OtpVerification";
import UpdatePassword from "@/components/Application/UpdatePassword";
import axios from "axios";

const ResetPassword = () => {
  /* ================= STATE ================= */
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(null); // ✅ NEW

  /* ================= EMAIL FORM ================= */
  const formSchema = zSchema.pick({ email: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  /* ================= SEND OTP ================= */
  const handleEmailVerification = async (values) => {
    try {
      setEmailLoading(true);

      const { data } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values
      );

      if (!data.success) throw new Error(data.message);

      setOtpEmail(values.email);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    } finally {
      setEmailLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleOtpVerificationSubmit = async (values) => {
    try {
      setOtpLoading(true);

      const payload = {
        email: otpEmail,
        otp: values.otp,
      };

      const { data } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        payload
      );

      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);

      setVerifiedOtp(values.otp); // ✅ SAVE OTP
      setIsOtpVerified(true);
    } catch (error) {
      showToast("error", error.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Card className="w-[420px] shadow-lg border rounded-2xl">
      <CardContent className="p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="logo"
            className="max-w-[140px]"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {!otpEmail
              ? "Reset Password"
              : !isOtpVerified
              ? "Verify OTP"
              : "Create New Password"}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {!otpEmail
              ? "Enter your email to receive a reset code"
              : !isOtpVerified
              ? "Enter the OTP sent to your email"
              : "Choose a strong new password"}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {!otpEmail ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailVerification)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                text="Send OTP"
                type="submit"
                loading={emailLoading}
                className="w-full"
              />

              <div className="text-center mt-4">
                <Link
                  href={WEBSITE_LOGIN}
                  className="text-primary underline text-sm"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        ) : !isOtpVerified ? (
          /* STEP 2: OTP */
          <OtpVerification
            email={otpEmail}
            loading={otpLoading}
            onSubmit={handleOtpVerificationSubmit}
          />
        ) : (
          /* STEP 3: UPDATE PASSWORD */
          <UpdatePassword email={otpEmail} otp={verifiedOtp} />
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;