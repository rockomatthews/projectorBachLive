import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = sortObject((value as Record<string, unknown>)[key]);
        return accumulator;
      }, {});
  }

  return value;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get("x-nowpayments-sig");

  if (process.env.NOWPAYMENTS_IPN_SECRET) {
    const expectedSignature = crypto
      .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)
      .update(JSON.stringify(sortObject(payload)))
      .digest("hex");

    if (!signature || signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  }

  return NextResponse.json({ received: true });
}
