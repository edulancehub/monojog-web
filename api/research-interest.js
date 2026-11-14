// Vercel serverless endpoint: keeps the Formspree endpoint in a server-side environment variable.
const MAX_LENGTHS = {
  name: 100,
  email: 200,
  contribution_area: 100,
  background: 160,
  interest: 120,
  message: 1500
};

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  // Quietly accept bot submissions without forwarding them.
  if (clean(body._gotcha, 200)) return res.status(200).json({ ok: true });

  const submission = {};
  for (const [field, maxLength] of Object.entries(MAX_LENGTHS)) {
    submission[field] = clean(body[field], maxLength);
  }
  submission.contact_consent = body.contact_consent === 'yes' ? 'yes' : '';

  if (!submission.name || !submission.email || !submission.contribution_area || !submission.interest || submission.contact_consent !== 'yes') {
    return res.status(400).json({ error: 'Please complete the required fields and consent checkbox.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    console.error('FORMSPREE_ENDPOINT is not configured.');
    return res.status(503).json({ error: 'The research form is temporarily unavailable. Please try again later.' });
  }

  let parsedEndpoint;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    return res.status(503).json({ error: 'The research form is temporarily unavailable. Please try again later.' });
  }
  if (parsedEndpoint.protocol !== 'https:' || parsedEndpoint.hostname !== 'formspree.io' || !/^\/f\/[\w-]+\/?$/.test(parsedEndpoint.pathname)) {
    console.error('FORMSPREE_ENDPOINT must be a valid https://formspree.io/f/<form-id> endpoint.');
    return res.status(503).json({ error: 'The research form is temporarily unavailable. Please try again later.' });
  }

  try {
    const upstream = await fetch(parsedEndpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...submission, _subject: 'New Monojog research interest' })
    });
    if (!upstream.ok) {
      console.error(`Formspree submission failed with status ${upstream.status}.`);
      return res.status(502).json({ error: 'We could not send your message just now. Please try again later.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Unable to reach Formspree:', error.message);
    return res.status(502).json({ error: 'We could not send your message just now. Please try again later.' });
  }
};
