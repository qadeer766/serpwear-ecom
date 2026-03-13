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
import { z } from 'zod'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formSchema = zSchema
    .pick({ name: true, email: true, password: true })
    .extend({
      confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true)

      const { data } = await axios.post("/api/auth/register", values)

      if (!data.success) throw new Error(data.message)

      form.reset()
      showToast('success', data.message)
    } catch (error) {
      showToast('error', error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="logo"
            className="max-w-[150px]"
          />
        </div>

        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p>Create a new account by filling the form below</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Developer Qadeer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative mb-4">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                    />
                  </FormControl>

                  <button
                    type="button"
                    className="absolute right-3 top-9"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading
              type="submit"
              text="Create Account"
              loading={loading}
              className="w-full"
            />

            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link href={WEBSITE_LOGIN} className="text-primary underline">
                  Login
                </Link>
              </p>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default RegisterPage
