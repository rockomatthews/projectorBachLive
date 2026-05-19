"use client";

import { FormEvent, useMemo, useState } from "react";
import { tipAmounts } from "@/lib/config";

type PaymentMethod = "stripe" | "crypto";

type CryptoPayment = {
  paymentId: string;
  paymentStatus: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  priceAmount: number;
  priceCurrency: string;
};

const cryptoOptions = [
  { id: "btc", label: "Bitcoin" },
  { id: "eth", label: "Ethereum" },
  { id: "usdttrc20", label: "USDT TRC20" },
  { id: "usdc", label: "USDC" },
  { id: "sol", label: "Solana" },
  { id: "doge", label: "Dogecoin" },
];

export function TippingPanel() {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [currency, setCurrency] = useState("btc");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cryptoPayment, setCryptoPayment] = useState<CryptoPayment | null>(null);
  const [copied, setCopied] = useState(false);

  const amount = useMemo(() => {
    const rawAmount = customAmount || selectedAmount;
    const parsed = Number(rawAmount);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [customAmount, selectedAmount]);

  const buttonLabel =
    method === "stripe"
      ? `Tip $${amount || 0} with Card/PayPal`
      : `Tip $${amount || 0} with Crypto`;

  function selectAmount(value: number) {
    setSelectedAmount(String(value));
    setCustomAmount("");
  }

  async function submitTip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);

    if (!amount || amount < 1) {
      setError("Choose or enter a tip amount of at least $1.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (method === "stripe") {
        const response = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, message }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Unable to start Stripe checkout.");
        }

        const payload = (await response.json()) as { url?: string };
        if (!payload.url) {
          throw new Error("Stripe did not return a checkout URL.");
        }

        window.location.href = payload.url;
        return;
      }

      const response = await fetch("/api/payments/nowpayments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, message, currency }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to create crypto invoice.");
      }

      setCryptoPayment((await response.json()) as CryptoPayment);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while creating your tip.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyAddress() {
    if (!cryptoPayment?.payAddress) {
      return;
    }

    await navigator.clipboard.writeText(cryptoPayment.payAddress);
    setCopied(true);
  }

  return (
    <section id="tips" className="tip-section" aria-labelledby="tip-title">
      <form className="tip-card" onSubmit={submitTip}>
        <div className="section-heading">
          <p className="eyebrow">Support the broadcast</p>
          <h2 id="tip-title">Tip Projector Bach</h2>
        </div>

        <fieldset className="method-grid">
          <legend>Choose Payment Method</legend>
          <button
            type="button"
            className={method === "stripe" ? "active" : ""}
            onClick={() => setMethod("stripe")}
          >
            Card / PayPal
          </button>
          <button
            type="button"
            className={method === "crypto" ? "active" : ""}
            onClick={() => setMethod("crypto")}
          >
            Cryptocurrency
          </button>
        </fieldset>

        <fieldset className="amount-grid">
          <legend>Quick Amounts</legend>
          <div>
            {tipAmounts.map((value) => (
              <button
                key={value}
                type="button"
                className={selectedAmount === String(value) ? "active" : ""}
                onClick={() => selectAmount(value)}
              >
                ${value}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="input-label">
          Custom Amount
          <span>
            $
            <input
              inputMode="decimal"
              min="1"
              name="amount"
              placeholder="0"
              type="number"
              value={customAmount}
              onChange={(event) => {
                setCustomAmount(event.target.value);
                setSelectedAmount("");
              }}
            />
          </span>
        </label>

        {method === "crypto" ? (
          <label className="input-label">
            Crypto Currency
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              {cryptoOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="input-label">
          Leave a message (optional)
          <textarea
            maxLength={240}
            placeholder="Say something nice..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="tip-submit" disabled={isSubmitting || amount < 1}>
          {isSubmitting ? "Processing..." : buttonLabel}
        </button>

        <p className="payment-note">
          {method === "stripe"
            ? "Supports card, PayPal, Apple Pay, Google Pay, and other eligible Stripe payment methods."
            : "Supports crypto payments through NOWPayments."}
        </p>
      </form>

      {cryptoPayment ? (
        <div className="crypto-dialog" role="dialog" aria-modal="true">
          <div className="crypto-dialog-card">
            <button
              className="dialog-close"
              type="button"
              onClick={() => setCryptoPayment(null)}
              aria-label="Close crypto payment details"
            >
              Close
            </button>
            <p className="eyebrow">Crypto invoice</p>
            <h3>Send your tip</h3>
            <p>
              Send exactly{" "}
              <strong>
                {cryptoPayment.payAmount} {cryptoPayment.payCurrency}
              </strong>{" "}
              to this address.
            </p>
            <code>{cryptoPayment.payAddress}</code>
            <button type="button" onClick={copyAddress}>
              {copied ? "Copied" : "Copy address"}
            </button>
            <p className="payment-note">
              Status: {cryptoPayment.paymentStatus || "waiting"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
