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
      'Content-Type': 'application/json',
      'api-key': apiKey,
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
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2>Bienvenue sur Artisalib</h2>
            <p>Merci pour votre inscription.</p>
            <p>Cliquez sur le bouton ci-dessous pour confirmer votre compte :</p>
            <p>
              <a href="${link}" style="display:inline-block;padding:12px 18px;background:#D4900A;color:#fff;text-decoration:none;border-radius:8px;">
                Confirmer mon compte
              </a>
            </p>
            <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
            <p>${link}</p>
          </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Brevo send email error:', errorText);
    throw new Error('Failed to send verification email');
  }
}