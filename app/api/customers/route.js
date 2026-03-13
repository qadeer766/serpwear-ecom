import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import UserModel from "@/models/user.model";
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

    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // ---------------------------
    // Build Match Query
    // ---------------------------
    let matchQuery = {
      role: "user", // ✅ Only customers
    };

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // ---------------------------
    // Global Search
    // ---------------------------
    if (globalFilter) {
      const booleanSearch =
        globalFilter.toLowerCase() === "true"
          ? true
          : globalFilter.toLowerCase() === "false"
          ? false
          : null;

      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
        ...(booleanSearch !== null
          ? [{ isEmailVerified: booleanSearch }]
          : []),
      ];
    }

    // ---------------------------
    // Column Filters
    // ---------------------------
    filters.forEach((filter) => {
      if (filter.id === "isEmailVerified") {
        matchQuery.isEmailVerified =
          filter.value === "true" ? true : false;
      } else {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    // ---------------------------
    // Sorting
    // ---------------------------
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // ---------------------------
    // Aggregation
    // ---------------------------
    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $sort: Object.keys(sortQuery).length
          ? sortQuery
          : { createdAt: -1 },
      },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          avatar: 1,
          isEmailVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const customers = await UserModel.aggregate(aggregatePipeline);
    const totalRowCount = await UserModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: customers,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}