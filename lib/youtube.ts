import { siteConfig } from "@/lib/config";

type YouTubeSearchResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
};

export async function getLiveVideoId() {
  if (siteConfig.youtubeLiveVideoId) {
    return siteConfig.youtubeLiveVideoId;
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return "";
  }

  const params = new URLSearchParams({
    part: "id",
    channelId: siteConfig.youtubeChannelId,
    eventType: "live",
    type: "video",
    key: process.env.YOUTUBE_API_KEY,
  });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return "";
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    return data.items?.[0]?.id?.videoId || "";
  } catch {
    return "";
  }
}

export function getYouTubeLiveEmbedUrl() {
  const params = new URLSearchParams({
    channel: siteConfig.youtubeChannelId,
    autoplay: "1",
    mute: "1",
    rel: "0",
    modestbranding: "1",
  });

  return `https://www.youtube.com/embed/live_stream?${params.toString()}`;
}

export function getYouTubeChatEmbedUrl(videoId: string) {
  const parent = new URL(siteConfig.siteUrl).host;
  const params = new URLSearchParams({
    v: videoId,
    embed_domain: parent,
  });

  return `https://www.youtube.com/live_chat?${params.toString()}`;
}
