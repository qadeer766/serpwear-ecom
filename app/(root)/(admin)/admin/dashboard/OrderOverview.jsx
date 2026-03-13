"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const chartConfig = {
  amount: {
    label: "Revenue",
    color: "#7c3aed",
  },
};

export default function OrderOverview() {

  const [chartData, setChartData] = useState([]);

  const { data: monthlySales } =
    useFetch("/api/dashboard/admin/monthly-sales");

  useEffect(() => {

    if (monthlySales?.length) {

      const getChartData = months.map((month, index) => {

        const monthData = monthlySales.find(
          (item) => item._id.month === index + 1
        );

        return {
          month,
          amount: monthData ? monthData.totalSales : 0,
        };

      });

      setChartData(getChartData);
    }

  }, [monthlySales]);

  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#eee"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <ChartTooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={<ChartTooltipContent />}
          />

          <Bar
            dataKey="amount"
            fill="#7c3aed"
            radius={[8,8,0,0]}
            barSize={32}
          />

        </BarChart>

      </ResponsiveContainer>

    </ChartContainer>
  );
}