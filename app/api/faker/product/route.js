

import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/productVariant.model";

function getRandomItems(array, count = 1) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function POST() {
  try {
    await connectDB();

    // ✅ Only active categories
    const categories = await CategoryModel.find({
      deletedAt: null,
    }).lean();

    if (!categories.length) {
      return response(false, 400, "No active categories found!");
    }

    const mediaList = await MediaModel.find().lean();

    if (!mediaList.length) {
      return response(false, 400, "No media found!");
    }

    const mediaMap = mediaList.map((media) => media._id);

    const colors = ["Red", "Blue", "Green", "Black"];
    const sizes = ["S", "M", "L", "XL", "2XL"];

    let products = [];
    let variants = [];

    for (const category of categories) {
      for (let i = 0; i < 5; i++) {
        const mrp = Number(faker.commerce.price(500, 2000, 0));
        const discountPercentage = faker.number.int({ min: 10, max: 50 });
        const sellingPrice = Math.round(
          mrp - (mrp * discountPercentage) / 100
        );

        const productId = new mongoose.Types.ObjectId();
        const selectedMedia = getRandomItems(mediaMap, 4);

        const product = {
          _id: productId,
          name: faker.commerce.productName(),
          slug: faker.helpers.slugify(
            faker.commerce.productName().toLowerCase()
          ),
          categoryId: category._id,
          mrp,
          sellingPrice,
          discountPercentage,
          media: selectedMedia, // ✅ Product uses "media"
          description: faker.commerce.productDescription(),
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        products.push(product);

        // ✅ Create variants (4 colors × 5 sizes)
        for (const color of colors) {
          for (const size of sizes) {
            const variantMedia = getRandomItems(mediaMap, 4);

            variants.push({
              _id: new mongoose.Types.ObjectId(),
              productId: productId, // ✅ must match model
              color,
              size,
              mrp,
              sellingPrice,
              discountPercentage,
              sku: `${product.slug}-${color}-${size}-${faker.number.int({
                min: 1000,
                max: 9999,
              })}`,
              medias: variantMedia, // ✅ FIXED (not media)
              deletedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }
    }

    await ProductModel.insertMany(products);
    await ProductVariantModel.insertMany(variants);

    return response(true, 200, "Fake data generated successfully.");
  } catch (error) {
    return response(false, 500, error.message);
  }
}

