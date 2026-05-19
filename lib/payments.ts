export type NowPaymentsCreateResponse = {
  payment_id?: string;
  payment_status?: string;
  pay_address?: string;
  pay_amount?: number;
  pay_currency?: string;
  price_amount?: number;
  price_currency?: string;
  order_id?: string;
};

export type CryptoPayment = {
  paymentId: string;
  paymentStatus: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  priceAmount: number;
  priceCurrency: string;
};

export function normalizeAmount(value: unknown) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 1) {
    throw new Error("Tip amount must be at least $1.");
  }

  if (amount > 10000) {
    throw new Error("Tip amount is too large.");
  }

  return Math.round(amount * 100) / 100;
}

export function normalizeMessage(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 240);
}

export function normalizeCryptoPayment(
  payload: NowPaymentsCreateResponse,
): CryptoPayment {
  return {
    paymentId: String(payload.payment_id || ""),
    paymentStatus: String(payload.payment_status || ""),
    payAddress: String(payload.pay_address || ""),
    payAmount: Number(payload.pay_amount || 0),
    payCurrency: String(payload.pay_currency || ""),
    priceAmount: Number(payload.price_amount || 0),
    priceCurrency: String(payload.price_currency || "usd"),
  };
}
