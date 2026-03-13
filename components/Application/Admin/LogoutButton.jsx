"use client";

import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/authReducer";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/logout");

      if (!data.success) {
        throw new Error(data.message || "Logout failed");
      }

      dispatch(logout());

      showToast("success", data.message || "Logged out successfully");

      // Replace instead of push (better for logout)
      router.replace(WEBSITE_LOGIN);
      router.refresh(); // clear cached server components
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      disabled={loading}
      className="cursor-pointer gap-2 text-red-500 focus:text-red-600"
      aria-disabled={loading}
    >
      <AiOutlineLogout size={18} />
      {loading ? "Logging out..." : "Logout"}
    </DropdownMenuItem>
  );
};

export default LogoutButton;