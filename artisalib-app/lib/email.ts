import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationEmail(email: string, link: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY missing. Verification link:', link);
    return;
  }

  await resend.emails.send({
    from: process.env.MAIL_FROM || 'onboarding@resend.dev',
    to: email,
    subject: 'Confirme ton compte',
    html: `
      <h1>Bienvenue sur Artisalib</h1>
      <p>Clique ici pour confirmer ton compte :</p>
      <a href="${link}">Confirmer mon compte</a>
    `,
  });
}