import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";
import ReviewModel from "@/models/review.model";

import MediaModel from "@/models/media.model";
export async function GET(request, context) {
  try {
    await connectDB();

    const { params } = context;
    const resolvedParams = await params; // 🔥 REQUIRED in Next 16
    const slug = resolvedParams.slug;

    const searchParams = request.nextUrl.searchParams;
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    if (!slug) {
      return response(false, 404, "Product not found.");
    }

    const product = await ProductModel.findOne({
      slug: slug,
      deletedAt: null,
    })
      .populate("media", "secure_url")
      .lean();

    if (!product) {
      return response(false, 404, "Product not found.");
    }
    
  

    const variantFilter = {
      productId: product._id,
      deletedAt: null,
    };

    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    const variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media", "secure_url")
      .lean();

    if (!variant) {
      return response(false, 404, "Variant not found.");
    }

    const colors = await ProductVariantModel.distinct("color", {
      productId: product._id,
      deletedAt: null,
    });

    const sizeDocs = await ProductVariantModel.find(
      { productId: product._id, deletedAt: null },
      { size: 1 }
    ).lean();

    const sizes = [...new Set(sizeDocs.map((item) => item.size))];

    const reviewCount = await ReviewModel.countDocuments({
      productId: product._id,
      deletedAt: null,
    });

    return response(true, 200, "Product data found.", {
      product,
      variant,
      colors,
      sizes,
      reviewCount,
    });

    
  } catch (error) {
    return catchError(error);
  }
}