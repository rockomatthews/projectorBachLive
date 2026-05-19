import { StreamStage } from "@/components/StreamStage";
import { TippingPanel } from "@/components/TippingPanel";
import { siteConfig } from "@/lib/config";
import { getLiveVideoId } from "@/lib/youtube";

export default async function Home() {
  const liveVideoId = await getLiveVideoId();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Projector Bach 24/7 TV - Live Stream",
    description: siteConfig.description,
    embedUrl: `https://www.youtube.com/embed/live_stream?channel=${siteConfig.youtubeChannelId}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    isLiveBroadcast: true,
    startDate: new Date().toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <StreamStage liveVideoId={liveVideoId} />
        <TippingPanel />
      </main>
    </>
  );
}
