import { NextResponse } from "next/server";
import Stripe from "stripe";
import { normalizeAmount, normalizeMessage } from "@/lib/payments";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      amount?: unknown;
      message?: unknown;
    };
    const amount = normalizeAmount(body.amount);
    const message = normalizeMessage(body.message);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteConfig.siteUrl}/?tip=success`,
      cancel_url: `${siteConfig.siteUrl}/?tip=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "Projector Bach tip",
              description: message || "Support the 24/7 stream",
            },
          },
        },
      ],
      metadata: {
        source: "projectorbach.tv",
        message,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create checkout.",
      },
      { status: 400 },
    );
  }
}
