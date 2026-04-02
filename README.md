# Artisalib

Starter full-stack prêt à déployer pour une plateforme de mise en relation artisans/particuliers :

- **Particuliers** : recherche, profils artisans, réservation, espace client
- **Artisans** : compte pro, abonnement Basic/Premium, agenda, devis, avis
- **Admin** : métriques de pilotage
- **Sécurité** : mots de passe hashés, sessions JWT HttpOnly, validation Zod, email verification, webhooks Stripe

## Stack

- Next.js 15 (App Router)
- TypeScript
- Prisma
- SQLite par défaut pour démarrer, **PostgreSQL recommandé en production**
- Stripe pour les abonnements artisans
- Resend pour l’envoi des emails de confirmation

## Installation

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

## Comptes de démo après seed

- `admin@artisalib.local`
- `artisan@artisalib.local`
- `client@artisalib.local`
- Mot de passe : `ChangeMe123!`

## Variables d’environnement à compléter

Voir `.env.example`.

### Stripe

Créer deux prix récurrents dans Stripe :

- `STRIPE_PRICE_BASIC` = prix mensuel 40€ HT
- `STRIPE_PRICE_PREMIUM` = prix mensuel 90€ HT

Puis :

1. créer le compte Stripe à ton nom
2. récupérer `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
3. créer le webhook vers `/api/stripe/webhook`
4. récupérer `STRIPE_WEBHOOK_SECRET`

### Email

1. créer le domaine email pro (`no-reply@tondomaine.fr`)
2. connecter le domaine à Resend ou Brevo
3. renseigner `RESEND_API_KEY` et `MAIL_FROM`

## Déploiement

### Option simple

- Vercel pour l’app Next.js
- Neon / Supabase / Railway pour PostgreSQL
- Resend pour les emails
- Stripe pour les paiements

### Étapes

1. passer `DATABASE_PROVIDER=postgresql`
2. définir `DATABASE_URL` PostgreSQL
3. exécuter `npm run prisma:migrate`
4. renseigner toutes les variables d’environnement dans l’hébergeur
5. brancher le webhook Stripe en production

## Sécurité incluse

- hash bcrypt des mots de passe
- cookie de session HttpOnly
- validation serveur Zod
- vérification email avant connexion
- webhook Stripe signé
- séparation clés secrètes / publiques via variables d’environnement

## À compléter avant mise en production finale

- mentions légales / CGU / politique de confidentialité
- limitation de taux (rate limit)
- logs structurés
- anti-spam sur formulaires
- stockage fichiers / avatars
- mot de passe oublié
- dashboard admin enrichi
- génération PDF de devis
