// One place for everything the build writes into <head>, the sitemap, the
// structured data and the share image. Change SITE_URL when the real domain
// is live; every absolute URL is derived from it.
export const SITE_URL = 'https://ayanakhtar.dev';

export const site = {
  url: SITE_URL,
  name: 'Ayan Akhtar',
  firstName: 'Ayan',
  lastName: 'Akhtar',
  jobTitle: 'DevOps & Cloud Engineer',
  title: 'Ayan Akhtar | DevOps & Cloud Engineer | AWS, Terraform, Docker | Open to Work',
  description: 'DevOps and Cloud Engineer with production AWS experience in CI/CD, Terraform, Docker, ECS and Fargate. Available immediately for full-time roles.',
  themeColor: '#070a14',
  backgroundColor: '#070a14',
  locale: 'en_US',
  email: 'ayanakhtar37.35@gmail.com',
  address: { locality: 'Udaipur', region: 'Rajasthan', country: 'IN' },
  alumniOf: 'Sir Padampat Singhania University',
  knowsAbout: ['AWS', 'Terraform', 'Docker', 'GitHub Actions', 'Jenkins', 'Amazon ECS', 'AWS Fargate', 'CI/CD', 'Linux', 'IAM'],
  credentials: [
    { name: 'Oracle Cloud Infrastructure Foundations Associate', issuer: 'Oracle', year: '2025' },
  ],
  sameAs: ['https://www.linkedin.com/in/ayan-akhtar', 'https://github.com/ayanakhtar04'],
  ogImage: '/og-image.png',
  ogImageAlt: 'Ayan Akhtar, DevOps & Cloud Engineer. Open to work.',
};

// Absolute URL for a site path ('/' stays the bare origin plus slash).
export const absolute = (path = '/') => new URL(path, `${SITE_URL}/`).href;
