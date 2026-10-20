# Flock

## Setup

### Frontend
**Prerequisites:** Node.js

1. Install dependencies

   ```bash
   cd frontend
   npm install
   ```

2. Start dev server
   
*Note* Dev server can be started from both the root folder AND /frontend

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:3000`.

---
### Backend (Docker)
**Prerequisites:** Docker

1. Create a new .env file in the **root** folder (`/flock`) based on the example file.
```bash
   cp .env.example .env
   ```
3. Change DATABASE_URL to say `@postgres` instead of `@localhost`
4. Run the following line from root folder

   ```
   docker compose up --build -d
   ```

   - Wait for the containers to be created and start
     
5. Run from root folder.
   ```
   docker compose exec express-api npx prisma migrate deploy
   ```
The server will be running at `http://localhost:4000`.

---
### Local database

If you want a visual representation of the database and tables, open prisma studio:

1. Create a new .env file in the **/backend** folder based on the example file.
```bash
cd backend
   cp .env.example .env
   ```
2. Run local database in Prisma Studio
```bash
cd backend
npx prisma studio
```

The visual representation of the local database will running at `http://localhost:51212`.

*Important:* You need to run this command in a separate terminal because your development server (npm run dev) must stay running at the same time.

## Changes in the backend
**After changing server dependencies**
After changing dependencies in the server, rebuild with
  ```
  docker compose up --build --renew-anon-volumes -d
  ```
This is sthe same if someone else has updated the backend dependencies and you pull their changes from github.

---

**Changes in Prisma Schema**
When you have made a change in `prisma.schema`:
```
cd backend
npx prisma migrate dev --name [name of migration]
```

**When you, or someone else, as created a new migration**
1. Run
   ```
   docker compose exec express-api npx prisma migrate deploy
   ```
2. Run
   ```
   docker compose exec express-api npx prisma generate
   ```
3. Run
   ```
   docker compose restart express-api
   ```

## Run api tests

From /backend run:

```
npm run test:api:full
```

And all tests will run with the test database (docker commands are included in the script)

## Production Database in Neon
If you want to connect your localhost to the production database.
### Point db to production

1. Go to Neon flock project --> connect
2. Turn connection pooling OFF
3. Copy the URL from .env section
4. Paste it into your local .env, replacing your local db connection string
5. Run:

```bash
npx prisma migrate deploy
```

### View database tables in Neon

Go to the neon flock project --> Postgress database --> Tables

## Deployment
### Deploy frontend in Vercel
To deploy frontend to [Vercel](https://vercel.com), create a new pull request from `main` --> `production`.
This will create a new deployment in Vercel. Inspect build logs to ensure that everything is correct.
**NOTE:** *Never* commit directly to `production`.

---

### Deploy backend in Render
To deploy backend to [Render](https://render.com), create a new pull request from `main` --> `production`.
If server is not correctly deployed, log in to Render and create a manual deployment.

## Project structure

```bash
flock/
│
├─ shared config and root files
│
├─ frontend/                 # Frontend
│  ├─ public/                # Static assets
│  │
│  ├─ src/
│  │  ├─ app/                # Next.js App routing
│  │  │  ├── (protected)/    # Private pages protected by auth
│  │  │  └─ login/
│  │  │
│  │  ├─ features/           # Feature components, hooks, etc.
│  │  │  └─ event/           # etc.
│  │  │     ├── components/
│  │  │     ├── hooks/
│  │  │     └── utils/
│  │  │
│  │  └─ shared/             # Shared components, hooks, etc.
│  │     ├── components/
│  │     ├── hooks/
│  │     ├── types/
│  │     └── utils/
│  │
│  └─ config and root files  # node_modules, .next, etc.
│
├─ backend/                  # Backend
│   ├─ api-tests/            # Postman tests
│   │
│   ├─ prisma/
│   │  ├─ migrations/        # SQL migration history
│   │  └─ schema.prisma      # Data model + generator/datasource config
│   │
│   ├─ server/
│   │  ├─ controllers/       # Handles HTTP requests and validations
│   │  ├─ middleware/        # e.g. auth, error handling, image uploads
│   │  ├─ routes/            # Express route handlers
│   │  ├─ services/          # Database communication and business logic
│   │  ├─ types/           
│   │  └─ utils/
│   │
│   └─ index.ts              # App entrypoint
│
└─ shared/                 
    └─ schemas/              # zod schemas and inferred types
```
