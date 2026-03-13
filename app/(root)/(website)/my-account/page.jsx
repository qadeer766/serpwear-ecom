'use client'

import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoCartOutline } from 'react-icons/io5'

import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute'

const breadCrumbData = {
  title: 'Dashboard',
  links: [{ label: 'Dashboard' }]
}

const MyAccount = () => {

  const { data: dashboardData, loading } = useFetch('/api/dashboard/user')
  const cartStore = useSelector((store) => store.cartStore)

  const orders = dashboardData?.recentOrders || []
  const totalOrders = dashboardData?.totalOrder || 0

  if (loading) {
    return <div className='p-10 text-center'>Loading dashboard...</div>
  }

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className='shadow rounded'>

          <div className='p-5 text-xl font-semibold border'>
            Dashboard
          </div>

          <div className='p-5'>

            {/* Dashboard Stats */}
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>

              <div className='flex items-center justify-between gap-5 border rounded p-3'>
                <div>
                  <h4 className='font-semibold text-lg mb-1'>Total Orders</h4>
                  <span className='font-semibold text-gray-500'>
                    {totalOrders}
                  </span>
                </div>

                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                  <HiOutlineShoppingBag className='text-white' size={25} />
                </div>
              </div>

              <div className='flex items-center justify-between gap-5 border rounded p-3'>
                <div>
                  <h4 className='font-semibold text-lg mb-1'>Item In Cart</h4>
                  <span className='font-semibold text-gray-500'>
                    {cartStore?.count || 0}
                  </span>
                </div>

                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                  <IoCartOutline className='text-white' size={25} />
                </div>
              </div>

            </div>

            {/* Recent Orders */}
            <div className='mt-5'>
              <h4 className='text-lg font-semibold mb-3'>Recent Orders</h4>

           <div className='overflow-auto'>
                <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Sr.No.
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Order id
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Total Item
                    </th>
                    <th className="text-start p-2 text-sm border-b text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center p-5 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}

                  {orders.map((order, i) => (
                    <tr key={order._id}>
                      <td className="text-start text-sm text-gray-500 p-2 font-bold">
                        {i + 1}
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        <Link
                          className="underline hover:text-blue-500 underline-offset-2"
                          href={WEBSITE_ORDER_DETAILS(order.order_id)}
                        >
                          {order.order_id}
                        </Link>
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        {order.products?.length || 0}
                      </td>

                      <td className="text-start text-sm text-gray-500 p-2">
                        {order.totalAmount?.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
            </div>

          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyAccount