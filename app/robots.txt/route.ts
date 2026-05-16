export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /payment
Disallow: /admin

Sitemap: https://thezilpo.com/sitemap.xml`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
