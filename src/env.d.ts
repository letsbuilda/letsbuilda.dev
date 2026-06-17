/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Auth0 tenant domain, e.g. `id.letsbuilda.dev`. Public, non-secret. */
  readonly PUBLIC_AUTH0_DOMAIN: string;
  /** Auth0 SPA application client ID. Public, non-secret. */
  readonly PUBLIC_AUTH0_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
