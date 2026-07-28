/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://bouncydigital.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  generateIndexSitemap: false,
  exclude: [
    '/404',
    '/500',
    '/api/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/wp-admin/', '/404', '/500', '/api/*'],
      },
      {
        userAgent: '*',
        allow: '/wp-admin/admin-ajax.php',
      },
    ],
  },
}
