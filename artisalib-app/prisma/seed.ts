import { PrismaClient, Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { addDays, addHours, startOfTomorrow } from 'date-fns';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Artisalib',
      email: 'admin@artisalib.local',
      passwordHash,
      emailVerifiedAt: new Date(),
      role: Role.ADMIN,
    },
  });

  const artisanUser = await prisma.user.create({
    data: {
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'artisan@artisalib.local',
      passwordHash,
      emailVerifiedAt: new Date(),
      phone: '0601020304',
      role: Role.ARTISAN,
      artisanProfile: {
        create: {
          slug: 'jean-martin-electricien-paris',
          businessName: 'Jean Martin Électricité',
          trade: 'Électricien',
          city: 'Paris',
          zipCode: '75011',
          bio: 'Installation, rénovation, dépannage urgent et mise aux normes.',
          yearsExperience: 12,
          hourlyRateCents: 6500,
          fixedRateCents: 12000,
          visible: true,
          isPremium: true,
          companyName: 'JME SASU',
          phonePublic: '0601020304',
          subscriptionPlan: SubscriptionPlan.PREMIUM,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          trialEndsAt: addDays(new Date(), 30)
        }
      }
    },
    include: { artisanProfile: true }
  });

  const client = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Dupont',
      email: 'client@artisalib.local',
      passwordHash,
      emailVerifiedAt: new Date(),
      role: Role.CLIENT,
    },
  });

  const slots = Array.from({ length: 6 }).map((_, index) => {
    const start = addHours(startOfTomorrow(), 8 + index * 2);
    return {
      artisanId: artisanUser.artisanProfile!.id,
      startsAt: start,
      endsAt: addHours(start, 1),
    };
  });

  await prisma.availabilitySlot.createMany({ data: slots });

  const booking = await prisma.booking.create({
    data: {
      clientId: client.id,
      artisanId: artisanUser.artisanProfile!.id,
      startsAt: addHours(startOfTomorrow(), 10),
      endsAt: addHours(startOfTomorrow(), 11),
      address: '12 rue Oberkampf',
      city: 'Paris',
      postalCode: '75011',
      requestNote: 'Prise à remplacer dans la cuisine',
      status: 'CONFIRMED',
    },
  });

  await prisma.quote.create({
    data: {
      bookingId: booking.id,
      artisanId: artisanUser.artisanProfile!.id,
      amountCents: 18000,
      description: 'Déplacement + remplacement prise + vérification circuit',
      status: 'SENT',
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      artisanId: artisanUser.artisanProfile!.id,
      authorId: client.id,
      rating: 5,
      comment: 'Très pro, ponctuel et travail propre. Je recommande.',
    },
  });

  console.log({ admin: admin.email, artisan: artisanUser.email, client: client.email, password: 'ChangeMe123!' });
}

main().finally(() => prisma.$disconnect());
