# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔐 Auth0 configuration

Authentication uses the [`@auth0/auth0-spa-js`](https://github.com/auth0/auth0-spa-js)
SDK (Authorization Code + PKCE). Configuration comes from two **public,
non-secret** environment variables:

| Variable                 | Description                  |
| :----------------------- | :--------------------------- |
| `PUBLIC_AUTH0_DOMAIN`    | Auth0 tenant domain          |
| `PUBLIC_AUTH0_CLIENT_ID` | Auth0 SPA application client ID |

Copy `.env.example` to `.env` for local development, and set the same variables
in the Cloudflare build environment for deploys (Astro inlines `PUBLIC_*` values
at build time).

In the Auth0 application (type: **Single Page Application**), add both your local
(`http://localhost:4321`) and production (`https://letsbuilda.dev`) origins to
**Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**,
and enable **Refresh Token Rotation**.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
