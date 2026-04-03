import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(to: string, token: string) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const link = `${appUrl}/api/auth/verify-email?token=${token}`;

  if (!resend) {
    console.warn('RESEND_API_KEY missing. Verification link:', link);
    return;
  }

  await resend.emails.send({
    from: process.env.MAIL_FROM || 'Artisalib <no-reply@example.com>',
    to,
    subject: 'Confirmez votre compte Artisalib',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h1 style="color:#18181B">Bienvenue sur Artisalib</h1>
        <p>Confirmez votre adresse email pour activer votre compte.</p>
        <p style="margin:24px 0"><a href="${link}" style="background:#D4900A;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Confirmer mon compte</a></p>
        <p>Ou copiez ce lien : ${link}</p>
        <p>Ce lien expire dans 24 heures.</p>
      </div>
    `,
  });
}
