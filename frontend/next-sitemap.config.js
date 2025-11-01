/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://theharyanajobalert.com', // <-- replace with your domain
  generateRobotsTxt: true,            // Generates robots.txt too
  sitemapSize: 7000,                  // Optional: splits if > 7000 URLs
  changefreq: 'daily',
  priority: 0.7,
};
