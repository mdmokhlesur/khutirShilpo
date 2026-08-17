This is official kutirShilpo source code

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the Firebase values plus your Postgres connection string:

```bash
cp .env.example .env.local
```

The database connection uses `NEXT_PUBLIC_DATABASE_URL`, for example:

```env
NEXT_PUBLIC_DATABASE_URL=postgresql://postgres:password@localhost:5432/kutir_shilpo
```

Create the Postgres tables before running the app:

```bash
psql "$NEXT_PUBLIC_DATABASE_URL" -f database/schema.sql
```

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## About this Project
- This is my first startup project.
- I started this project in 2021 after COVID.
- My two friends and I started this project together.
- We won the Best Project award in my batch, which inspired me to continue working on it.
