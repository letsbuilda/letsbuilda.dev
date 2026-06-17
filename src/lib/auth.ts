import {
  type Auth0Client,
  createAuth0Client,
  type User,
} from "@auth0/auth0-spa-js";

// Both values are public, non-secret identifiers for this SPA's Authorization
// Code + PKCE flow. They are inlined at build time from PUBLIC_* environment
// variables (see .env.example).
const domain = import.meta.env.PUBLIC_AUTH0_DOMAIN;
const clientId = import.meta.env.PUBLIC_AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  throw new Error(
    "Missing Auth0 configuration. Set PUBLIC_AUTH0_DOMAIN and PUBLIC_AUTH0_CLIENT_ID.",
  );
}

// State carried across the login redirect so we can return the user to the
// page they started from (Auth0 always redirects back to the origin).
interface AppState {
  returnTo?: string;
}

let clientPromise: Promise<Auth0Client> | null = null;

// Finish the login redirect if this page received it, then forward the user to
// wherever they began. Safe to call on every page load.
async function handleRedirect(client: Auth0Client): Promise<void> {
  const query = window.location.search;
  if (!query.includes("code=") || !query.includes("state=")) {
    return;
  }

  const { appState } = await client.handleRedirectCallback<AppState>();
  window.history.replaceState({}, document.title, window.location.pathname);

  const returnTo = appState?.returnTo;
  if (returnTo && returnTo !== window.location.pathname) {
    window.location.assign(returnTo);
  }
}

// Create the client once per page load and finish any login redirect before the
// promise resolves, so every caller observes the post-login state regardless of
// the order in which page scripts run.
async function bootstrap(): Promise<Auth0Client> {
  const client = await createAuth0Client({
    domain,
    clientId,
    // Persist the session across this multi-page site's full page reloads and
    // renew it with rotating refresh tokens instead of the hidden-iframe flow
    // that modern browsers increasingly block.
    useRefreshTokens: true,
    cacheLocation: "localstorage",
    authorizationParams: {
      redirect_uri: window.location.origin,
      scope: "openid profile email",
    },
  });

  await handleRedirect(client);
  return client;
}

function getClient(): Promise<Auth0Client> {
  if (!clientPromise) {
    clientPromise = bootstrap();
  }
  return clientPromise;
}

// Initialise auth for the current page (processing any login redirect) and
// report whether the visitor is logged in. Call once per page from the layout.
export async function initPage(): Promise<boolean> {
  const client = await getClient();
  return client.isAuthenticated();
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await getClient();
  return client.isAuthenticated();
}

export async function getUser(): Promise<User | undefined> {
  const client = await getClient();
  return client.getUser();
}

// Redirect to Auth0 to log in, returning to `returnTo` afterwards.
export async function login(
  returnTo: string = window.location.pathname,
): Promise<void> {
  const client = await getClient();
  await client.loginWithRedirect<AppState>({ appState: { returnTo } });
}

// Log out and return to the site root.
export async function logout(): Promise<void> {
  const client = await getClient();
  await client.logout({ logoutParams: { returnTo: window.location.origin } });
}
