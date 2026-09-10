## Mon suivi de candidatures

Une petite application personnelle pour organiser sa recherche d'un nouvel
emploi : un tableau façon Kanban pour suivre chaque candidature (à postuler,
envoyée, entretien, offre, refusée), avec entreprise, poste, lien de
l'offre, secteur, lieu, salaire visé et notes.

Stack : [Next.js](https://nextjs.org) (App Router) + [Prisma](https://www.prisma.io)
avec une base de données PostgreSQL (hébergée gratuitement sur Render).

### Démarrer en local

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL avec ta base Postgres
npx prisma migrate deploy
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Structure

- `app/page.tsx` — le tableau Kanban (recherche, stats, colonnes par statut)
- `app/api/applications` — API REST (CRUD) des candidatures
- `prisma/schema.prisma` — modèle de données `Application`
- `components/` — carte de candidature et formulaire d'ajout/édition

### Prochaines idées

- Authentification si l'app est déployée en ligne
- Rappels/relances automatiques après X jours sans réponse
- Import d'offres depuis un lien (scraping du titre/entreprise)
