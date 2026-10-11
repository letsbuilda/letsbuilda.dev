# Contributing

The site is a static [Astro](https://docs.astro.build) build served by a Cloudflare Worker
(`wrangler.jsonc`). Cloudflare Workers Builds deploys `main`.

## Setup

Use the Node version in `.nvmrc`, then:

```sh
npm ci
npm run dev      # http://localhost:4321
npm run check    # lint, type check, build: what CI runs
npm run preview  # serve the build through Wrangler
```

## Auth0

Login uses the Auth0 SPA SDK (`src/lib/auth.ts`) against the tenant on `id.letsbuilda.dev`.
The domain and client ID are public and live in that file, so there is no `.env`.

The Auth0 application must list each origin you run the site from (production and
`http://localhost:4321`) under Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins.
