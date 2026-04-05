export async function sendVerificationEmail(email: string, link: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.MAIL_FROM;

  console.log("BREVO KEY =", apiKey ? "OK" : "MISSING");
  console.log("MAIL_FROM =", from);
  console.log("EMAIL DEST =", email);
  console.log("LINK =", link);

  if (!apiKey || !from) {
    console.warn("Email config manquante");
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // timeout 8s

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
        subject: 'Confirme ton compte Artisalib',
        htmlContent: `<p>Bonjour,</p><p><a href="${link}">Clique ici pour confirmer ton compte</a></p>`,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await response.text();
    console.log("BREVO STATUS =", response.status);
    console.log("BREVO RESPONSE =", text);

    if (!response.ok) {
      console.error("BREVO ERROR =", response.status, text);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error("EMAIL TIMEOUT : Brevo n'a pas répondu en 8s");
    } else {
      console.error("EMAIL ERROR =", err);
    }
  }
}