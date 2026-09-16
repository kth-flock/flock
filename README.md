# Flock

## Project structure

```bash
flock/
│
├─ frontend/                 # Frontend
│  ├─ public/                # Static assets
│  │
│  ├─ src/
│  │  ├─ app/                # Next.js App routing
│  │  │  └─ event/
│  │  │
│  │  ├─ features/           # Feature components, hooks, etc.
│  │  │  └─ event/
│  │  │
│  │  └─ shared/             # Shared components, hooks, etc.
│  │     ├── components/
│  │     ├── hooks/
│  │     ├── types/
│  │     └── utils/
│  │
│  └─ config and root files    # node_modules, .next, etc.
│
│
└─ backend/                  # Backend
    ├─ prisma/
    │  ├─ schema.prisma      # Data model + generator/datasource config
    │  ├─ migrations/        # SQL migration history
    │  └─ generated/         # Generated Prisma Client (gitignored)
    │
    ├─ server/
    │  ├─ routes/            # Express route handlers
    │  └─ prisma.ts          # Shared PrismaClient instance
    │
    ├─ index.ts              # App entrypoint
    ├─ docker-compose.yaml   # Local Postgres container
    ├─ prisma.config.ts      # Prisma CLI config (loads .env)
    └─ .env.example          # Template for required env vars
```

## Backend setup

**Prerequisites:** Node.js, Docker

1. Install dependencies

   ```bash
   cd backend
   npm install
   ```

2. Create your `.env` file from the template and fill in real values

   ```bash
   cp .env.example .env
   ```

3. Start Postgres

   ```bash
   docker compose up -d
   ```

4. Run migrations and generate the Prisma client

   ```bash
   npx prisma migrate dev
   ```

   Sometimes you may also need to run the following command as well

   ```bash
   npx prisma generate
   ```

5. Start the dev server

   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:3000`.

## Local Database

To run local database if docker container is off:

```bash
docker run --name flockdatabase -e POSTGRES_PASSWORD=yourpassword -p 5434:5432 -d postgres:14.5
```

After editing schema.prisma, for example when you add a table or update a table, run:

### 1 Create new migration

Replace the "migration-name" with a short description of your change.

```bash
npx prisma migrate dev --name migration-name
```

### 2 Regenerate Prisma Client

```bash
npx prisma generate
```

### Prisma Studio

If you want a visual representation of the database and tables, open prisma studio:

```bash
npx prisma studio
```

This command will open a browser at http://localhost:51212 where you can see your database.

Important: You need to run this command in a separate terminal because your development server (npm run dev) must stay running at the same time.

## Server

IMPORTANT: All routes need to import the prisma.ts file at the top of the files.
