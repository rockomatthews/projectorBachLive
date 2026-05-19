import { NextResponse } from "next/server";
import {
  normalizeAmount,
  normalizeCryptoPayment,
  normalizeMessage,
} from "@/lib/payments";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

const suggestedCurrencies = [
  "btc",
  "eth",
  "usdttrc20",
  "usdc",
  "sol",
  "doge",
];

export async function GET() {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return NextResponse.json({ currencies: suggestedCurrencies });
  }

  try {
    const response = await fetch(
      "https://api.nowpayments.io/v1/currencies?fixed_rate=true",
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ currencies: suggestedCurrencies });
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ currencies: suggestedCurrencies });
  }
}

export async function POST(request: Request) {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return NextResponse.json(
      { error: "NOWPayments is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      amount?: unknown;
      message?: unknown;
      currency?: unknown;
    };
    const amount = normalizeAmount(body.amount);
    const message = normalizeMessage(body.message);
    const currency =
      typeof body.currency === "string" ? body.currency.toLowerCase() : "btc";
    const orderId = `projectorbach-${Date.now()}`;

    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        pay_currency: currency,
        order_id: orderId,
        order_description: message || "Projector Bach tip",
        ipn_callback_url: `${siteConfig.siteUrl}/api/payments/nowpayments/ipn`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Unable to create NOWPayments invoice.");
    }

    return NextResponse.json(normalizeCryptoPayment(await response.json()));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create crypto payment.",
      },
      { status: 400 },
    );
  }
}
