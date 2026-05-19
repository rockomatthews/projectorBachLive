import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return NextResponse.json(
      { error: "NOWPayments is not configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json(
      { error: "Missing paymentId." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.nowpayments.io/v1/payment/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Unable to fetch payment status.");
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch payment status.",
      },
      { status: 400 },
    );
  }
}
