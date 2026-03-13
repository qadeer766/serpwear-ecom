import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ReviewModel from "@/models/review.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    let matchQuery = { deletedAt: null };

    if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    if (globalFilter) {
      matchQuery["$or"] = [
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$rating" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    filters.forEach((filter) => {
      if (filter.id === "product") {
        matchQuery["productData.name"] = { $regex: filter.value, $options: "i" };
      } else if (filter.id === "user") {
        matchQuery["userData.name"] = { $regex: filter.value, $options: "i" };
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    const lookupStages = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
    ];

    const dataPipeline = [
      ...lookupStages,
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          user: "$userData.name",
          rating: 1,
          review: 1,
          title: 1,
          createdAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const countPipeline = [
      ...lookupStages,
      { $match: matchQuery },
      { $count: "count" },
    ];

    const [reviews, totalResult] = await Promise.all([
      ReviewModel.aggregate(dataPipeline),
      ReviewModel.aggregate(countPipeline),
    ]);

    const totalRowCount = totalResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}