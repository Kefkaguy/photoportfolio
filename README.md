This is a [Next.js](https://nextjs.org) photography portfolio with a public site and a lightweight admin panel.

## Getting Started

First, install dependencies and start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the public site.

This repo now contains:

- the public portfolio app at the repo root
- a separate admin app in [admin-site](C:\Users\erosi\OneDrive\Desktop\dadweb\photoportfolio\admin-site)

## Environment

Create `.env.local` from `.env.example` and set:

- `MONGODB_URI`
- `MONGODB_DB`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `S3_PUBLIC_BASE_URL` (optional if you expose the bucket through a CDN or custom domain)

## Storage

- Categories and image metadata are stored in MongoDB.
- Image files upload directly from the browser to Amazon S3 using presigned URLs.
- If MongoDB is not configured, the public homepage falls back to `data/portfolio.json`.
- The first time MongoDB is connected, the app seeds the database from the local JSON data and also ensures the default categories exist: `Portraits`, `Weddings`, `Watches`, `Travel`.

## Admin app

The admin panel is a separate Next.js app in [admin-site](C:\Users\erosi\OneDrive\Desktop\dadweb\photoportfolio\admin-site) so it can be deployed on a different domain. Run it from that directory with its own environment variables and deploy it as a separate project.
