# Projector Bach TV

Fresh rebuild of `projectorbach.tv` with a comic-style live stream page,
YouTube live playback, mandatory chat overlay, and tipping through Stripe or
NOWPayments.

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add the production values before
deploying.

## Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`: public site URL, for example `https://projectorbach.tv`
- `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID`: defaults to `UCNed650oEtpFfW6gHNCpXXQ`
- `NEXT_PUBLIC_YOUTUBE_LIVE_VIDEO_ID`: fallback live video ID for chat embeds
- `YOUTUBE_API_KEY`: optional key for resolving the active live video ID
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe restricted or secret key for Checkout Sessions
- `NOWPAYMENTS_API_KEY`: NOWPayments API key
- `NOWPAYMENTS_IPN_SECRET`: optional IPN signature secret
