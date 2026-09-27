const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const name = `${fields.get('first')} ${fields.get('last')}`.trim();
  const body = `${fields.get('message')}\n\nFrom: ${name}\nEmail: ${fields.get('email')}`;
  window.location.href = `mailto:jovitaandrewsw@gmail.com?subject=${encodeURIComponent('Portfolio enquiry from ' + name)}&body=${encodeURIComponent(body)}`;
  document.getElementById('form-status').textContent = 'Email draft requested. If your email app did not open, email jovitaandrewsw@gmail.com directly.';
});
