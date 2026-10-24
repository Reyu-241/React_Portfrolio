import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Configure the production sitemap URL when the site is deployed.
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
