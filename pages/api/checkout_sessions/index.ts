import type { NextApiRequest, NextApiResponse } from "next";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

type ResponseData = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { line_items } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["DE", "US"],
        },
        success_url: `${req.headers.origin}/confirmation/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.status(200).json(session);
    } catch (err) {
      console.error("Something went wront during Stripe session creation.");
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
