"use client";

import { PieChart, Pie, Label, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

const chartConfig = {
  pending: { label: "Pending", color: "#3b82f6" },
  processing: { label: "Processing", color: "#eab308" },
  shipped: { label: "Shipped", color: "#06b6d4" },
  delivered: { label: "Delivered", color: "#22c55e" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
  unverified: { label: "Unverified", color: "#f97316" },
};

export default function OrderStatus() {

  const [chartData, setChartData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { data: orderStatus, loading } =
    useFetch("/api/dashboard/admin/order-status");
   useEffect(() => {

  if (Array.isArray(orderStatus)) {

    const newOrderStatus = orderStatus.map((o) => ({
      status: o._id,
      count: o.count,
    }));

    setChartData(newOrderStatus);

    const total = orderStatus.reduce(
      (acc, curr) => acc + curr.count,
      0
    );

    setTotalCount(total);
  }

}, [orderStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[260px] text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>

      {/* Donut Chart */}

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[260px]"
      >

        <PieChart>

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />

          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={65}
            outerRadius={100}
            strokeWidth={2}
          >

            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={chartConfig[entry.status]?.color || "#ccc"}
              />
            ))}

            {/* Center Label */}

            <Label
              content={({ viewBox }) => {
                if (!viewBox?.cx || !viewBox?.cy) return null;

                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalCount}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 24}
                      className="fill-muted-foreground text-sm"
                    >
                      Orders
                    </tspan>
                  </text>
                );
              }}
            />

          </Pie>

        </PieChart>

      </ChartContainer>

      {/* Legend */}

      <ul className="mt-5 space-y-2">

        {chartData.map((item) => (

          <li
            key={item.status}
            className="flex justify-between items-center text-sm"
          >

            <div className="flex items-center gap-2">

              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    chartConfig[item.status]?.color || "#ccc",
                }}
              />

              <span className="capitalize">
                {chartConfig[item.status]?.label}
              </span>

            </div>

            <span className="font-medium">
              {item.count}
            </span>

          </li>

        ))}

      </ul>

    </div>
  );
}