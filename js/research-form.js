/* Research interest form. Sends to a same-origin Vercel Function so the Formspree endpoint stays in server-side environment configuration. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('researchInterestForm');
  const status = document.getElementById('researchFormStatus');
  if (!form || !status) return;

  const setupNote = form.querySelector('.form-setup-note');
  if (setupNote) {
    setupNote.textContent = 'Your submission is sent securely through Monojog’s Vercel endpoint. Contact details are used only to respond to your research interest.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.classList.remove('is-error', 'is-success');
    if (!form.reportValidity()) return;

    const values = Object.fromEntries(new FormData(form).entries());
    if (values._gotcha) return;
    delete values._gotcha;

    const submitButton = form.querySelector('[type="submit"]');
    const originalLabel = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    status.textContent = 'Sending your research interest…';

    try {
      const response = await fetch('/api/research-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(values)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The form service could not accept this submission.');

      form.reset();
      status.textContent = 'Thank you for sharing your interest. This is not study enrollment; Monojog may contact you if a relevant opportunity becomes available.';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = error.message || 'We could not send your message just now. Please try again later.';
      status.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
});
