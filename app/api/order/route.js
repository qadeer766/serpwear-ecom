import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import OrderModel from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    const auth = await isAuthenticated("admin");

    if (!auth?.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    let filters = [];
    let sorting = [];

    try {
      filters = JSON.parse(searchParams.get("filters") || "[]");
      sorting = JSON.parse(searchParams.get("sorting") || "[]");
    } catch {}

    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType");

    /* ---------------- MATCH QUERY ---------------- */

    let matchQuery = { deletedAt: null };

    if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    /* ---------------- GLOBAL SEARCH ---------------- */

    if (globalFilter) {
      matchQuery.$or = [
        { order_id: { $regex: globalFilter, $options: "i" } },
        { payment_id: { $regex: globalFilter, $options: "i" } },
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { country: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { state: { $regex: globalFilter, $options: "i" } },
        { city: { $regex: globalFilter, $options: "i" } },
        { status: { $regex: globalFilter, $options: "i" } }
      ];
    }

    /* ---------------- COLUMN FILTERS ---------------- */

    filters.forEach((filter) => {
      matchQuery[filter.id] = {
        $regex: filter.value,
        $options: "i",
      };
    });

    /* ---------------- SORTING ---------------- */

    let sortQuery = {};

    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    if (!Object.keys(sortQuery).length) {
      sortQuery = { createdAt: -1 };
    }

    /* ---------------- AGGREGATION ---------------- */

    const aggregatePipeline = [
      { $match: matchQuery },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: sortQuery },

      { $skip: start },

      { $limit: size },
    ];

    const orders = await OrderModel.aggregate(aggregatePipeline);

    const totalRowCount = await OrderModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        totalRowCount,
      },
    });

  } catch (error) {
    return catchError(error);
  }
}