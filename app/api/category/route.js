

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    // Safe parsing for pagination and filters
    const start = Number(searchParams.get("start")) || 0;
    const size = Number(searchParams.get("size")) || 10;

    let filters = [];
    let sorting = [];

    try {
      filters = JSON.parse(searchParams.get("filters") || "[]");
      sorting = JSON.parse(searchParams.get("sorting") || "[]");
    } catch (e) {
      filters = [];
      sorting = [];
    }

    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType") || "SD";

    // Build match query for category data
    let matchQuery = {};

    // Handle delete type (SD = soft delete, PD = permanent delete)
    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global search filter
    if (globalFilter.trim()) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column filters
    filters.forEach((filter) => {
      if (filter?.id && filter?.value) {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    // Sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      if (sort?.id) {
        sortQuery[sort.id] = sort.desc ? -1 : 1;
      }
    });

    // Default sort by createdAt in descending order
    if (!Object.keys(sortQuery).length) {
      sortQuery = { createdAt: -1 };
    }

    // Aggregation pipeline to get categories based on filters and pagination
    const data = await CategoryModel.aggregate([
      { $match: matchQuery }, // Apply filters
      { $sort: sortQuery }, // Apply sorting
      { $skip: start }, // Skip pagination
      { $limit: size }, // Limit the number of results
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ]);

    // Get total count of documents matching the query
    const totalRowCount = await CategoryModel.countDocuments(matchQuery);

    // Return the paginated results along with meta information
    return NextResponse.json({
      success: true,
      data,
      meta: { totalRowCount },
    });

  } catch (error) {
    return catchError(error);
  }
}