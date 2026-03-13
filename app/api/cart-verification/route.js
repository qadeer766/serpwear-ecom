import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";

export async function POST(request) {
  try {

    await connectDB();

    const payload = await request.json();

    if (!Array.isArray(payload)) {
      return response(false, 400, "Invalid cart data.");
    }

    const verifiedCartData = await Promise.all(
      payload.map(async (cartItem) => {

        const variant = await ProductVariantModel
  .findById(cartItem.variantId)
  .populate("productId")
  .populate("media", "secure_url")
  .lean();

        if (!variant) return null;

      return {
  productId: variant.productId._id,
  variantId: variant._id,
  name: variant.productId.name,
  url: variant.productId.slug,
  size: variant.size,
  color: variant.color,
  mrp: variant.mrp,
  sellingPrice: variant.sellingPrice,
  media: variant?.media?.[0]?.secure_url,
  qty: cartItem.qty,
};
      })
    );

    const filteredCart = verifiedCartData.filter(Boolean);

    return response(
      true,
      200,
      "Verified Cart Data.",
      filteredCart
    );

  } catch (error) {
    return catchError(error);
  }
}