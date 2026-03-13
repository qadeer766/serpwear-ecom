import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import CouponModel from "@/models/coupon.model";
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

    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    let filters = [];
    let sorting = [];

    try {
      filters = JSON.parse(searchParams.get("filters") || "[]");
      sorting = JSON.parse(searchParams.get("sorting") || "[]");
    } catch {
      filters = [];
      sorting = [];
    }

    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType");

    // ---------------- MATCH QUERY ----------------
    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // ---------------- GLOBAL SEARCH ----------------
    if (globalFilter) {
      matchQuery.$or = [
        { code: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    // ---------------- COLUMN FILTERS ----------------
    filters.forEach((filter) => {
      if (!filter?.value) return;

      if (
        filter.id === "minShoppingAmount" ||
        filter.id === "discountPercentage"
      ) {
        const numberValue = Number(filter.value);
        if (!isNaN(numberValue)) {
          matchQuery[filter.id] = numberValue;
        }
      } else if (filter.id === "validity") {
        matchQuery.validity = new Date(filter.value);
      } else {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    // ---------------- SORTING ----------------
    let sortQuery = {};

    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    if (!Object.keys(sortQuery).length) {
      sortQuery = { createdAt: -1 };
    }

    // ---------------- AGGREGATION ----------------
    const aggregatePipeline = [
      { $match: matchQuery },
      { $sort: sortQuery },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          discountPercentage: 1,
          minShoppingAmount: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const coupons = await CouponModel.aggregate(aggregatePipeline);
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: coupons,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}