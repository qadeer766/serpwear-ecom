"use client"
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const UserPanelNavigation = () => {
    const pathname = usePathname()

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
    <div className='border shadow-sm p-4 rounded'>
       <ul>
         <li className='mb-2'>
            <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ? 'bg-primary text-white' : ''} `}>Dashboard</Link>
         </li>
         <li className='mb-2'>
            <Link href={USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_PROFILE) ? 'bg-primary text-white' : ''} `}>Profile</Link>
         </li>
         <li className='mb-2'>
            <Link href={USER_ORDERS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_ORDERS) ? 'bg-primary text-white' : ''} `}>Orders</Link>
         </li>
         <li className='mb-2'>
            <Button type='button' onClick={handleLogout} variant="destructive" className='w-full cursor-pointer'>Logout</Button>
         </li>
       </ul>
    </div>
  )
}

export default UserPanelNavigation
