import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) redirect('/login');

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) redirect('/login');

  await prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } });
  await prisma.emailVerificationToken.delete({ where: { token } });

  redirect('/login');
}
