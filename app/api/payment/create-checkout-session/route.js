// app/api/payment/create-checkout-session/route.js

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
      amount: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing fields.",
        validate.error
      );
    }

    const { amount } = validate.data;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "SerpWear Order",
            },
            unit_amount: Number(amount) * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    });

    return response(true, 200, "Checkout session created.", {
  checkoutUrl: session.url,
});
  } catch (error) {
    return catchError(error);
  }
}