export async function sendVerificationEmail(email: string, link: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey) {
    console.warn('BREVO_API_KEY missing. Verification link:', link);
    return;
  }

  if (!from) {
    console.warn('MAIL_FROM missing. Verification link:', link);
    return;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'X-Mailin-Track': '0',
      'Content-Type': 'application/json',
      'api-key': apiKey,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Artisalib',
        email: from,
      },
      to: [{ email }],
      subject: 'Confirmez votre compte Artisalib',
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>Bienvenue sur Artisalib</h2>
            <p>Merci pour votre inscription.</p>
            <p>Cliquez ci-dessous :</p>

            <a href="${link}" style="display:inline-block;padding:12px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
              Confirmer mon compte
            </a>

            <p>Ou copie ce lien :</p>
            <p>${link}</p>
          </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Brevo send email error:', errorText);
    return;
  }

  console.log("EMAIL SENT SUCCESS");
}