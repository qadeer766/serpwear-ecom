"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera } from "react-icons/fa";

import ButtonLoading from "@/components/Application/ButtonLoading";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";

import userIcon from "@/public/assets/images/user.png";
import { login } from "@/store/reducer/authReducer";

const breadCrumbData = {
  title: "Profile",
  links: [{ label: "Profile" }],
};

const Profile = () => {
  const dispatch = useDispatch();

  const { data: user } = useFetch("/api/profile/get");

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();

  const formSchema = zSchema.pick({
    name: true,
    phone: true,
    address: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user && user.success) {
      const userData = user.data;

      form.reset({
        name: userData?.name || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
      });

      setPreview(userData?.avatar?.url);
    }
  }, [user, form]);

  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;

    const selectedFile = files[0];

    const previewUrl = URL.createObjectURL(selectedFile);

    setPreview(previewUrl);
    setFile(selectedFile);
  };

  const updateProfile = async (values) => {
  setLoading(true);

  try {
    const formData = new FormData();

    if (file) {
      formData.set("file", file);
    }

    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("address", values.address);

    const { data: response } = await axios.put(
      "/api/profile/update",
      formData
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    showToast("success", response.message);

    // update redux user
    dispatch(login(response.data));

    // update avatar preview safely
    if (response.data?.avatar?.url) {
      setPreview(response.data.avatar.url);
    }

    // reset form with latest data
    form.reset({
      name: response.data.name,
      phone: response.data.phone,
      address: response.data.address,
    });

    // clear uploaded file
    setFile(null);

  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className="shadow rounded">

          <div className="p-5 text-xl font-semibold border-b">
            Profile
          </div>

          <div className="p-5">

            <Form {...form}>
              <form
                className="grid md:grid-cols-2 grid-cols-1 gap-5"
                onSubmit={form.handleSubmit(updateProfile)}
              >

                {/* Avatar Upload */}
                <div className="md:col-span-2 flex justify-center items-center">

                  <Dropzone onDrop={handleFileSelection}>
                    {({ getRootProps, getInputProps }) => (

                      <div {...getRootProps()} className="cursor-pointer">

                        <input {...getInputProps()} />

                        <Avatar className="w-28 h-28 relative group border">

                          <AvatarImage
                            src={preview ? preview : userIcon.src}
                          />

                          <div className="absolute inset-0 flex justify-center items-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition">

                            <FaCamera color="white" />

                          </div>

                        </Avatar>

                      </div>

                    )}
                  </Dropzone>

                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>

                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <div className="md:col-span-2">

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Enter your address"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                {/* Submit */}
                <div className="md:col-span-2">

                  <ButtonLoading
                    text="Save Changes"
                    type="submit"
                    loading={loading}
                  />

                </div>

              </form>
            </Form>

          </div>

        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Profile;