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

## Frontend setup

**Prerequisites:** Node.js

1. Install dependencies

   ```bash
   cd frontend
   npm install
   ```

2. Start dev server

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:3000`.

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

5. Start the dev server

   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:4000`.

## Local Database

To run local database if docker container is off:

```bash
docker run --name flockdatabase -e POSTGRES_PASSWORD=yourpassword -p 5434:5432 -d postgres:14.5
```

After editing schema.prisma, for example when you add a table or update a table, run:

### After editing schema

#### 1 Create a new migration

Replace the "migration-name" with a short description of your change.

```bash
npx prisma migrate dev --name migration-name
```

#### 2 Regenerate Prisma Client

```bash
npx prisma generate
```

### When someone else has updated a schema

If someone else has updated a schema, you need to run

```bash
npx prisma migrate deploy
```

and

```bash
npx prisma generate
```

to get your local database up to date

### Prisma Studio

If you want a visual representation of the database and tables, open prisma studio:

```bash
npx prisma studio
```

This command will open a browser at http://localhost:51212 where you can see your database.

Important: You need to run this command in a separate terminal because your development server (npm run dev) must stay running at the same time.

## Server

IMPORTANT: All routes need to import the prisma.ts file at the top of the files.

## Docker

### How to get container on your machine

1. Create a new .env file in the **root** folder (`/flock`) based on the example file. You can probably copy over most of the things from your backend .env file.
2. Change DATABASE_URL to say `@postgres` instead of `@localhost`
3. Stop the running of your Postgres database in Docker
   - If you don't, it will conflict with the new database container that will be created in the next step.
   - You could completely remove the first Postgres container if you want to
4. Run the following line from root folder
    ```
    docker compose up --build -d
    ```
   - Wait for the containers to be created and start
6. Run from root folder.
   ```
   docker compose exec express-api npx prisma migrate deploy
   ```
   
8. Now you should be able to open `http://localhost:4000/` and have a server that is running.

### After updating dependencies in server

- After changing dependencies in the server, rebuild with
  ```
  docker compose up --build --renew-anon-volumes -d
  ```
- This is sthe same if someone else has updated the backend dependencies and you pull their changes from github.

#### If there's a new migration and/or schema.prisma has been updated

1. Run
   ```
   docker compose exec express-api npx prisma migrate deploy
   ```
3. Run
   ```
   docker compose exec express-api npx prisma generate
   ```
5. Run
   ```
   docker compose restart express-api
   ```

#### Two .env files

We now have two .env files: one in the root folder and one in the /backend folder. Follow the example files to see what belongs in each.

The backend/.env file is only needed if you want to run things on your local machine instead of through the Docker container.

> Prisma Studio only works when you run npx prisma studio in a terminal inside the backend folder.

Because of this, the backend/.env file needs the following line, with your own database username, password and name filled in:

`DATABASE_URL="postgresql://username:password@localhost:5432/databasename?schema=public"`
