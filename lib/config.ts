export const siteConfig = {
  name: "Projector Bach 24/7 TV",
  shortName: "Projector Bach",
  title: "Projector Bach Streams",
  description: "Professionally tipped streamer of everyday life",
  youtubeHandle: "@projectorbach69",
  youtubeChannelId:
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "UCNed650oEtpFfW6gHNCpXXQ",
  youtubeLiveVideoId: process.env.NEXT_PUBLIC_YOUTUBE_LIVE_VIDEO_ID || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const tipAmounts = [5, 10, 25, 50, 100];
