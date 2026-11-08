# Portfolio

A polished, configurable portfolio website powered by Next.js and GitHub Pages. Fork it, publish it for free, and make it yours from the built-in setup experience.

## Get your website online

1. **Fork** this repository on GitHub.
2. In your fork, open **Settings → Pages** and choose **GitHub Actions** as the source.
3. Open the **Actions** tab and enable the workflows when GitHub asks.
4. Run **Deploy portfolio to GitHub Pages** once from **Actions → Run workflow**.
5. Visit the Pages URL GitHub gives you.
6. Open the website's **Setup** area and update your content, appearance, and links.

Your fork stays connected to the upstream project and can receive future updates through the included sync workflow.

## SEO and domain migration

The deployment workflow sets `NEXT_PUBLIC_SITE_URL` from the GitHub Pages URL so canonical URLs, Open Graph URLs, Twitter cards, robots, and the sitemap are emitted as absolute URLs. If you connect a custom domain, configure that domain in GitHub Pages before deploying so the generated metadata uses the canonical domain.

When replacing an existing website, keep the old URL paths where possible. If a path changes, add a permanent redirect at the old host and submit the new sitemap in Google Search Console and Bing Webmaster Tools. Verify the deployed `/robots.txt`, `/sitemap.xml`, and representative page source before switching DNS.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development, configuration, contribution rules, and the pull request workflow.

## License

This project is available under the [Personal Use, Attribution, Non-Commercial License](LICENSE). You may use and modify it for personal, educational, and non-commercial purposes at no cost, provided that the required author attribution, project backlink, and license text remain intact. Commercial use, resale, redistribution, and use of any part of the project in a commercial product or service are not permitted without written permission.

---

With love, [Gaurav Nyaupane](https://github.com/nightmaregaurav) · [Upstream Project](https://github.com/nightmaregaurav/portfolio)
