import Stripe from "stripe";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/order.model";
import { isAuthenticated } from "@/lib/authentication";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();

    const auth = await isAuthenticated("user");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;

    const payload = await request.json();

    const {
      sessionId,
      products,
      amount,
      name,
      email,
      phone,
      country,
      state,
      city,
      landmark,
      ordernot
    } = payload;

    if (!sessionId || !products || !amount) {
      return response(false, 400, "Missing required fields.");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return response(false, 400, "Payment not verified.");
    }

    const subtotal = products.reduce(
      (sum, item) => sum + item.sellingPrice * item.qty,
      0
    );

    const discount = products.reduce(
      (sum, item) => sum + (item.mrp - item.sellingPrice) * item.qty,
      0
    );

    const totalAmount = amount;

  // Prevent duplicate orders
const existingOrder = await OrderModel.findOne({
  payment_id: sessionId
})

if (existingOrder) {
  return response(true, 200, "Order already exists", {
    orderId: existingOrder._id
  })
}


    const order = await OrderModel.create({
      user: userId,

      name,
      email,
      phone,

      country,
      state,
      city,

      address1: landmark,
      address2: landmark,

      ordernot,

      products,

      subtotal,
      discount,
      couponDiscount: 0,
      totalAmount,

      payment_id: sessionId,
      order_id: sessionId,
    });

    return response(true, 200, "Order saved successfully.", {
      orderId: order._id,
    });
  } catch (error) {
    return catchError(error);
  }
}