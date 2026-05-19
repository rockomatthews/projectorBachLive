import Image from "next/image";
import { getYouTubeChatEmbedUrl, getYouTubeLiveEmbedUrl } from "@/lib/youtube";
import { siteConfig } from "@/lib/config";

type StreamStageProps = {
  liveVideoId: string;
};

export function StreamStage({ liveVideoId }: StreamStageProps) {
  const chatUrl = liveVideoId ? getYouTubeChatEmbedUrl(liveVideoId) : "";
  const streamUrl = liveVideoId ? getYouTubeLiveEmbedUrl(liveVideoId) : "";

  return (
    <section id="stream" className="hero-section" aria-label="Live stream">
      <div className="stream-shell">
        <div className="stream-frame">
          {streamUrl ? (
            <iframe
              title="Projector Bach YouTube live stream"
              src={streamUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <Image
              className="starting-soon-image"
              src="/projectorBachLiveSoon.png"
              alt="Projector Bach is going live soon"
              fill
              priority
            />
          )}
          <aside className="chat-modal" aria-label="Live chat">
            <div className="chat-modal-header">
              <span>Live Chat</span>
              <a
                href={`https://youtube.com/${siteConfig.youtubeHandle}`}
                target="_blank"
                rel="noreferrer"
              >
                Open YouTube
              </a>
            </div>
            {chatUrl ? (
              <iframe
                title="Projector Bach YouTube live chat"
                src={chatUrl}
                className="chat-embed"
              />
            ) : (
              <div className="chat-fallback">
                <strong>Chat panel ready</strong>
                <p>
                  Add `NEXT_PUBLIC_YOUTUBE_LIVE_VIDEO_ID` or `YOUTUBE_API_KEY`
                  to resolve the active livestream chat.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
