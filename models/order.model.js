import mongoose from "mongoose";
import { orderStatus } from "@/lib/utils";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    address1: {
      type: String,
      required: true,
    },

    address2: {
      type: String,
      required: true,
    },

    ordernote: {
      type: String,
      default: "",
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },

        mrp: {
          type: Number,
          required: true,
        },

        sellingPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: orderStatus,
      default: "pending",
    },

    payment_id: {
      type: String,
      required: true,
    },

    order_id: {
      type: String,
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema, "orders");

export default OrderModel;