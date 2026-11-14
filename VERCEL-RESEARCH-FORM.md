# Vercel research-interest form setup

The research form posts to `/api/research-interest`, a Vercel serverless function. That function forwards validated submissions to Formspree, keeping the Formspree endpoint out of browser HTML and JavaScript.

## Configure the Formspree endpoint

1. Create a form in Formspree and copy its endpoint, in the form `https://formspree.io/f/your-form-id`.
2. In the Vercel project, open **Settings → Environment Variables**.
3. Add `FORMSPREE_ENDPOINT` with the full Formspree endpoint as its value. Do not add `https://formspree.io/f/xxx` unless `xxx` is the actual form ID from your Formspree account.
4. Apply it to the desired environments (at least Production), save, and redeploy the project.
5. Submit a test entry on the live `/research.html` page and confirm it arrives in Formspree.

The Vercel function validates required fields, email format, consent, and endpoint host; it also uses the hidden honeypot field as a basic bot check. Form submission means interest only—it is not consent or enrollment in a research study. Do not collect sensitive health details in this form.

Do not put the Formspree endpoint in a `VITE_`, `NEXT_PUBLIC_`, or other client-exposed variable. The function reads it server-side from `process.env.FORMSPREE_ENDPOINT`.
