import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(['CLIENT', 'ARTISAN']),
  businessName: z.string().optional(),
  trade: z.string().optional(),
  city: z.string().optional(),
  subscriptionPlan: z.enum(['BASIC', 'PREMIUM']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const bookingSchema = z.object({
  artisanId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  requestNote: z.string().optional(),
});
