// Content lives in data/*.json; edit those files to add projects or posts.
const CONTACT_EMAIL = 'jovitaandrewsw@gmail.com';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const loadJSON = path => fetch(path).then(res => {
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
});

const showError = (el, what) => {
  el.innerHTML = `<p class="subtle">Couldn’t load ${what}. Please refresh the page.</p>`;
};

const formatDate = iso => iso
  ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  : '';

const projectCard = p => `<article class="card"><a href="${esc(p.url)}" class="cover ${esc(p.color)}" aria-label="View ${esc(p.title)} project"><span class="cover-label">JOVITA ANDREWS / SELECTED WORK</span><strong>${esc(p.tagline)}</strong><span class="cover-bottom">${p.tags.map(esc).join(' · ')}<b aria-hidden="true">↗</b></span></a><h3><a href="${esc(p.url)}">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p></article>`;

const postURL = post => `post.html?slug=${encodeURIComponent(post.slug)}`;

const storyRow = (post, index) => `<a class="story-row" href="${postURL(post)}"><span class="story-icon">${String(index + 1).padStart(2, '0')}</span><div><h3>${esc(post.short_title || post.title)}</h3><p>${[formatDate(post.date), post.summary].filter(Boolean).map(esc).join(' · ')}</p></div><span>↗</span></a>`;

const articleBody = post => post.paragraphs.map(p => `<p>${esc(p)}</p>`).join('');

const projectTargets = document.querySelectorAll('[data-projects]');
if (projectTargets.length) {
  loadJSON('data/projects.json').then(data => {
    projectTargets.forEach(el => {
      const view = el.dataset.projects;
      if (view === 'more') {
        el.innerHTML = data.more.map(p => `<div><h3>${esc(p.title)}</h3><p>${p.tags.map(esc).join(' · ')}</p><p>${esc(p.summary)}</p></div>`).join('');
      } else {
        const list = view === 'home' ? data.featured.filter(p => p.home) : data.featured;
        el.innerHTML = list.map(projectCard).join('');
      }
    });
  }).catch(() => projectTargets.forEach(el => showError(el, 'projects')));
}

const postTargets = document.querySelectorAll('[data-posts]');
const postBody = document.getElementById('post-body');
if (postTargets.length || postBody) {
  loadJSON('data/posts.json').then(posts => {
    postTargets.forEach(el => {
      if (el.dataset.posts === 'latest') {
        el.innerHTML = posts.length ? storyRow(posts[0], 0) : '';
        return;
      }
      // Blog page: newest post in full, the rest as links.
      const [first, ...rest] = posts;
      if (!first) { el.innerHTML = '<p class="subtle">No posts yet.</p>'; return; }
      const kicker = [first.kicker, formatDate(first.date), 'Jovita Andrews'].filter(Boolean).join(' · ').toUpperCase();
      el.innerHTML = `<article class="prose article"><p class="overline">${esc(kicker)}</p><h2><a href="${postURL(first)}">“${esc(first.title)}”</a></h2>${articleBody(first)}</article>`
        + rest.map((post, i) => storyRow(post, i + 1)).join('');
    });

    if (postBody) {
      const slug = new URLSearchParams(location.search).get('slug');
      const post = posts.find(p => p.slug === slug);
      if (!post) {
        document.getElementById('post-title').textContent = 'Post not found';
        postBody.innerHTML = '<p>That post doesn’t exist. Try the blog for everything I’ve written.</p>';
        return;
      }
      document.title = `${post.title} | Jovita Andrews`;
      document.getElementById('post-title').textContent = post.title;
      document.getElementById('post-meta').textContent = [post.kicker, formatDate(post.date), 'Jovita Andrews'].filter(Boolean).join(' · ').toUpperCase();
      postBody.innerHTML = articleBody(post);
    }
  }).catch(() => {
    postTargets.forEach(el => showError(el, 'posts'));
    if (postBody) showError(postBody, 'this post');
  });
}

const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const fields = new FormData(form);
  const name = `${fields.get('first')} ${fields.get('last')}`.trim();

  // Until a Web3Forms access key is set, fall back to opening an email draft.
  if (fields.get('access_key').startsWith('YOUR_')) {
    const body = `${fields.get('message')}\n\nFrom: ${name}\nEmail: ${fields.get('email')}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Portfolio enquiry from ' + name)}&body=${encodeURIComponent(body)}`;
    status.textContent = `Email draft requested. If your email app did not open, email ${CONTACT_EMAIL} directly.`;
    return;
  }

  fields.set('name', name);
  fields.set('subject', `Portfolio message from ${name}`);
  fields.delete('first');
  fields.delete('last');
  button.disabled = true;
  status.textContent = 'Sending…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fields,
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || 'Request failed');
    form.reset();
    status.textContent = 'Thanks! Your message has been sent. I’ll get back to you soon.';
  } catch {
    status.textContent = `Sorry, your message couldn’t be sent. Please email ${CONTACT_EMAIL} directly.`;
  } finally {
    button.disabled = false;
  }
});
