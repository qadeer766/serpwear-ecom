


import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";
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

    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // ✅ LOOKUP FIRST
    const basePipeline = [
      {
        $lookup: {
          from: "products",
          localField: "productId", // ✅ FIXED
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // ✅ Global Search (after lookup)
    if (globalFilter) {
      matchQuery.$or = [
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column Filters
    filters.forEach((filter) => {
      if (filter.id === "product") {
        matchQuery["productData.name"] = {
          $regex: filter.value,
          $options: "i",
        };
      } else {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    const matchStage = { $match: matchQuery };

    // Sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    const dataPipeline = [
      ...basePipeline,
      matchStage,
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
          product: "$productData.name", // ✅ correct projection
          color: 1,
          size: 1,
          sku: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const variants = await ProductVariantModel.aggregate(dataPipeline);

    // Count Pipeline
    const countPipeline = [
      ...basePipeline,
      matchStage,
      { $count: "total" },
    ];

    const countResult = await ProductVariantModel.aggregate(countPipeline);
    const totalRowCount = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: variants,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}