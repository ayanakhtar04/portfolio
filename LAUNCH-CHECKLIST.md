# Launch checklist

Steps only you can do, in roughly this order, once the site is live on its real domain.

## Before going live

- [ ] Put the real domain in `site.config.js` (`SITE_URL`). It's currently the
      placeholder `https://ayanakhtar.dev`.
- [ ] Update the résumé PDF (`public/Ayan_Akhtar_Resume.pdf`). It still shows
      "React & Cloud Engineer" and "present" for Brandskey, and it includes your phone
      number. Decide whether the phone number should be public.
- [ ] Two projects on the site have no public repository yet: **Terraform Reusable AWS
      Modules** and **Jenkins and Nginx CI/CD Server**. Their cards link to your GitHub
      profile. Publish the repos (then add `repo:` in `src/data/portfolio.js`) or keep it
      as is.
- [ ] Check the FargateFlow link. It points to `FargatFlow`. You also have
      `FargateFlow_SSP`, so pick whichever is the main one.
- [ ] Deploy (see `DEPLOYMENT.md`), map the domain and wait for the SSL certificate.
- [ ] Open `https://<domain>/does-not-exist` and confirm you see the custom 404 page.

## Search engines

- [ ] **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
      add a *Domain* property and verify it with the DNS TXT record it gives you.
- [ ] In Search Console, submit `https://<domain>/sitemap.xml` (Indexing > Sitemaps).
- [ ] In Search Console, use **URL Inspection** on the home page, then **Request indexing**.
- [ ] **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)): import the site
      from Search Console (quickest) or verify it separately, then submit the sitemap.

## Structured data and link previews

- [ ] **Rich Results Test** ([search.google.com/test/rich-results](https://search.google.com/test/rich-results)):
      run the live URL. It should detect the ProfilePage markup with no errors. Google
      shows profile rich results only for some kinds of sites, so "detected, no errors"
      is the goal.
- [ ] **Schema.org validator** ([validator.schema.org](https://validator.schema.org/)): run the live URL.
      It should show WebSite, ProfilePage and Person with no errors.
- [ ] **LinkedIn Post Inspector** ([linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)):
      inspect the URL. You should see the 1200x630 card with your name and "Open to Work".
      Re-run it after any change to refresh LinkedIn's cache.
- [ ] **WhatsApp:** send the link to yourself and check the preview. WhatsApp caches
      previews, so test with a fresh URL (for example add `?v=1`) after changes.

## Put the link everywhere recruiters look

- [ ] LinkedIn: **Contact info > Website** (type: Portfolio).
- [ ] LinkedIn: **Featured** section, add the link.
- [ ] GitHub profile: the **Website** field.
- [ ] GitHub profile README (`ayanakhtar04/ayanakhtar04`): add the URL near the top.
- [ ] Résumé: add the URL to the header.

## Keep an eye on it

- [ ] Set up a free uptime monitor for `https://<domain>/`. Options: UptimeRobot (free
      plan, 5-minute checks), Better Stack (free tier) or Zoho Site24x7 (free plan).
      Alert to your email.
- [ ] After a week, check Search Console's **Pages** and **Core Web Vitals** reports.
- [ ] No analytics are installed. If you want visitor numbers, pick a cookie-free,
      privacy-friendly option (for example GoatCounter, Plausible or Cloudflare Web
      Analytics) and add its script domain to the CSP in `vite.config.js`.
