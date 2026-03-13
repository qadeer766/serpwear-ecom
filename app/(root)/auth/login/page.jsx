'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/public/assets/images/logo-black.png'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import Link from 'next/link'
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD
} from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import OtpVerification from '@/components/Application/OtpVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import axios from 'axios'

const LoginPage = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
  const [isTypePassword, setIsTypePassword] = useState(true)
  const [otpEmail, setOtpEmail] = useState(null)

  const formSchema = zSchema.pick({ email: true, password: true })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  // LOGIN SUBMIT
  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true)
      const { data } = await axios.post("/api/auth/login", values)

      if (!data.success) throw new Error(data.message || "Login failed")

      // 🔹 Fix here: backend returns { email } for OTP
      setOtpEmail(data.data.email)
      form.reset()
      showToast('success', data.message)
    } catch (error) {
      // 🔹 Better error handling for Axios
      const message = error.response?.data?.message || error.message || "Something went wrong"
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  // OTP VERIFY SUBMIT
  const handleOtpVerificationSubmit = async (values) => {
    try {
      setOtpVerificationLoading(true)
      const { data } = await axios.post("/api/auth/verify-otp", {
        ...values,
        email: otpEmail,
      })

      if (!data.success) throw new Error(data.message || "OTP verification failed")

      setOtpEmail(null)
      dispatch(login(data.data))
      showToast('success', data.message)

      // 🔹 Handle callback query param or default dashboard
      const callback = searchParams.get('callback')
      if (callback) {
        router.push(callback)
      } else {
        data.data.role === 'admin'
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD)
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong"
      showToast('error', message)
    } finally {
      setOtpVerificationLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt="logo"
            className="max-w-[150px]"
          />
        </div>

        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Login Into Account</h1>
              <p>Login into your account by filling out the form below</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mb-3 relative">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={isTypePassword ? "password" : "text"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute top-1/2 right-2 -translate-y-1/2"
                          onClick={() => setIsTypePassword(!isTypePassword)}
                        >
                          {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    text="Login"
                    type="submit"
                    className="w-full cursor-pointer"
                    loading={loading}
                  />

                  <div className="text-center mt-4">
                    <div className="flex justify-center gap-1">
                      <p>Don&apos;t have account?</p>
                      <Link href={WEBSITE_REGISTER} className="text-primary underline">
                        Create account
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link href={WEBSITE_RESETPASSWORD} className="text-primary underline">
                        Forget Password
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <OtpVerification
            email={otpEmail}
            loading={otpVerificationLoading}
            onSubmit={handleOtpVerificationSubmit}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default LoginPage
