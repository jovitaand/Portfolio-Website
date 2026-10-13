# Jovita Andrews — portfolio

A Spotify-inspired portfolio with Home, About, Projects, Blog, Résumé, and Contact pages. Hosted on GitHub Pages; no build step.

## Update content
- **Projects:** edit `data/projects.json`. `featured` entries become cards on the Projects page (set `"home": true` to also show one on Home; `color` is one of violet, orange, green, blue, pink). `more` entries fill "More from my toolkit".
- **Blog posts:** add an entry to the top of `data/posts.json` with a unique `slug`, `title`, optional `date` (`YYYY-MM-DD`), `summary`, and `paragraphs`. The newest post appears in full on the Blog page and on Home; each post is also at `post.html?slug=<slug>`.
- Edit the HTML pages for About, Résumé, and Contact text; `style.css` for appearance; `site.js` for rendering and the contact form.
- `Jovita-Andrews-Resume.pdf` is the supplied September 2026 PDF.

## Contact form
Messages are delivered to jovitaandrewsw@gmail.com through [Web3Forms](https://web3forms.com):
1. Go to web3forms.com, enter jovitaandrewsw@gmail.com, and copy the access key it emails you.
2. In `contact.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with that key. (The key is meant to be public; it can only send to your inbox.)

Until the key is set, the form falls back to opening an email draft.

## Preview locally
Pages load their content with `fetch`, so open them through a local server rather than as files: `python3 -m http.server`, then visit http://localhost:8000.

Deploy from `main`, root folder.
