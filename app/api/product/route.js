

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Ensure admin is authenticated
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    // Parsing search parameters
    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // Default filter setup
    let matchQuery = { deletedAt: null };

    if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // Global Search logic for string fields and numeric fields
    if (globalFilter) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        {
          mrp: { $regex: globalFilter, $options: "i" },
        },
        {
          sellingPrice: { $regex: globalFilter, $options: "i" },
        },
        {
          discountPercentage: { $regex: globalFilter, $options: "i" },
        },
      ];
    }

    // Column-specific filters
    filters.forEach((filter) => {
      if (
        filter.id === "mrp" ||
        filter.id === "sellingPrice" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    // Sorting logic
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    if (Object.keys(sortQuery).length === 0) {
      sortQuery = { createdAt: -1 }; // Default sorting by created date
    }

    // Aggregation pipeline
    const aggregatePipeline = [
      {
        $lookup: {
  from: "categories",
  localField: "categoryId",   // ✅ CORRECT
  foreignField: "_id",
  as: "categoryData",
},
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true, // In case product doesn't have a category
        },
      },
      { $match: matchQuery }, // Match products based on filters
      { $sort: sortQuery }, // Apply sorting
      { $skip: start }, // Skip the pagination start
      { $limit: size }, // Limit results to the specified size
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          category: "$categoryData.name", // Only include category name
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute aggregation
    const products = await ProductModel.aggregate(aggregatePipeline);

    // Get total count of products for pagination
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}