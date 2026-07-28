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
    transformRobotsTxt: async (config, robotsTxt) => {
      return `# Robots.txt for Bouncy Digital\n\nUser-agent: *\nAllow: /\n\n# Block API routes from crawling\nDisallow: /api/*\n\n# Block custom error pages\nDisallow: /404\nDisallow: /500\n\n# Sitemap\nSitemap: https://bouncydigital.com/sitemap.xml\n`;
    },
  },
}
