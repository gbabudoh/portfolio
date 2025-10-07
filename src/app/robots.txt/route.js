export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://godwinportfolio.com/sitemap.xml

# Disallow admin panel
Disallow: /admin/

# Allow all other content
Allow: /api/
Allow: /_next/static/
Allow: /favicon.png
Allow: /og-image.png`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
