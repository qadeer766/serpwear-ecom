"use client";

import Link from "next/link";
import React from "react";
import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd"; // 🔥 renamed properly
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderOverview from "./OrderOverview";
import OrderStatus from "./OrderStatus";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";

import {
  
  ADMIN_ORDER_SHOW,
  ADMIN_REVIEW_SHOW,
} from "@/routes/AdminPanelRoute"; // ✅ use route constants

const AdminDashboard = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 space-y-8">

        {/*==== TOP STATS ====*/}
        <section>
          <CountOverview />
        </section>

        {/*==== QUICK ACTIONS ====*/}
        <section>
          <QuickAdd />
        </section>

        {/*==== ORDER OVERVIEW + STATUS ====*/}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ORDER OVERVIEW */}
          <Card className="rounded-lg col-span-2 shadow-sm">
            <CardHeader className="flex justify-between items-center border-b pb-3">
              <span className="font-semibold text-lg">Order Overview</span>
              <Button asChild size="sm">
                <Link href={ADMIN_ORDER_SHOW}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <OrderOverview />
            </CardContent>
          </Card>

          {/* ORDER STATUS */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="flex justify-between items-center border-b pb-3">
              <span className="font-semibold text-lg">Order Status</span>
              <Button asChild size="sm">
                <Link href={ADMIN_ORDER_SHOW}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <OrderStatus />
            </CardContent>
          </Card>
        </section>

        {/*==== LATEST ORDERS + REVIEWS ====*/}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LATEST ORDERS */}
          <Card className="rounded-lg col-span-2 shadow-sm">
            <CardHeader className="flex justify-between items-center border-b pb-3">
              <span className="font-semibold text-lg">Latest Orders</span>
              <Button asChild size="sm">
                <Link href={ADMIN_ORDER_SHOW}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 lg:h-[350px] overflow-auto">
              <LatestOrder />
            </CardContent>
          </Card>

          {/* LATEST REVIEWS */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="flex justify-between items-center border-b pb-3">
              <span className="font-semibold text-lg">Latest Reviews</span>
              <Button asChild size="sm">
                <Link href={ADMIN_REVIEW_SHOW}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 px-2 lg:h-[350px] overflow-auto">
              <LatestReview />
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;