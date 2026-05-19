import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Projector Bach home">
        <span>{siteConfig.shortName}</span>
        <strong>24/7 TV</strong>
      </Link>
    </header>
  );
}
