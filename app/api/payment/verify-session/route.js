// app/api/payment/verify-session/route.js

import Stripe from "stripe";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true, // we'll reuse string validator for sessionId
    }).transform((data) => ({
      sessionId: data._id,
    }));

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing session id.", validate.error);
    }

    const { sessionId } = validate.data;

    /* retrieve stripe session */

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return response(false, 404, "Stripe session not found.");
    }

    if (session.payment_status !== "paid") {
      return response(false, 400, "Payment not completed.");
    }

    return response(true, 200, "Payment verified.", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total,
      currency: session.currency,
    });

  } catch (error) {
    return catchError(error);
  }
}