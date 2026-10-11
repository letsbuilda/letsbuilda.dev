# Agent notes

- Static Astro site, no adapter and no UI framework. Page behavior is plain `<script>` tags; don't
  add React, Svelte or another islands framework without asking.
- `npm run check` must pass before you push (Biome, `astro check`, build).
- Keep tokens out of `localStorage`: the Auth0 client uses its default in-memory cache and restores
  the session silently from the same-site custom domain.
- Dependencies are pinned exactly (`.npmrc` sets `save-exact`). Dependabot updates them monthly.
