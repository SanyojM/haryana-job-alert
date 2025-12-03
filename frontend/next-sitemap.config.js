/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://theharyanajobalert.com', // <-- replace with your domain
  generateRobotsTxt: true,            // Generates robots.txt too
  sitemapSize: 7000,                  // Optional: splits if > 7000 URLs
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*'],
  additionalPaths: async (config) => {
    const res = await fetch('https://backend.theharyanajobalert.com/posts');
    const posts = await res.json();

    return posts.map((post) => ({
      loc: `/posts/${post.slug}`, // the route
      lastmod: post.createdAt || new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8,
    }));
  },
};
