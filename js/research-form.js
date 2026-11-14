/* Research interest form. Configure data-endpoint with the project's Formspree form URL. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('researchInterestForm');
  const status = document.getElementById('researchFormStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.classList.remove('is-error', 'is-success');

    if (!form.reportValidity()) return;

    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const endpoint = form.dataset.endpoint;
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      status.textContent = 'This interest form is not connected yet. The site owner needs to create a Formspree form and add its endpoint before applications can be received.';
      status.classList.add('is-error');
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    const originalLabel = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    status.textContent = 'Sending your research interest…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('The form service could not accept this submission.');
      form.reset();
      status.textContent = 'Thank you for sharing your interest. This is not study enrollment; Monojog may contact you if a relevant opportunity becomes available.';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = 'We could not send your message just now. Please try again later.';
      status.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
});
