import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';

const COOKIE_NAME = 'artisalib_session';

type SessionPayload = {
  userId: string;
  role: 'CLIENT' | 'ARTISAN' | 'ADMIN';
};

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { path: '/', expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { artisanProfile: true },
  });
}
