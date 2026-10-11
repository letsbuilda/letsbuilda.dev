import {
  type Auth0Client,
  createAuth0Client,
  type User,
} from "@auth0/auth0-spa-js";

// Public identifiers for this single-page app; neither is a secret. The tenant
// is served from a custom domain on the same site as letsbuilda.dev, so the
// SDK can restore a session from Auth0's cookie on each page load without
// keeping tokens in localStorage.
const AUTH0_DOMAIN = "id.letsbuilda.dev";
const AUTH0_CLIENT_ID = "THoRnVJxMOfLxMAW0kaNW8nuP1q8q3qQ";

// Carried across the login redirect so the visitor lands back on the page
// they started from (Auth0 always redirects to the site root).
interface AppState {
  returnTo?: string;
}

let clientPromise: Promise<Auth0Client> | null = null;

// Finish a login redirect if this page load is one, then send the visitor on
// to where they started. A failed or cancelled login comes back as `?error=`
// and leaves them signed out on the home page.
async function handleRedirect(client: Auth0Client): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("state") || !(params.has("code") || params.has("error"))) {
    return;
  }

  try {
    const { appState } = await client.handleRedirectCallback<AppState>();
    const returnTo = appState?.returnTo;
    if (returnTo?.startsWith("/") && returnTo !== window.location.pathname) {
      window.location.replace(returnTo);
      return;
    }
  } catch (error) {
    console.error("Login failed", error);
  }
  window.history.replaceState({}, document.title, window.location.pathname);
}

async function bootstrap(): Promise<Auth0Client> {
  // Tokens stay in memory (the SDK default). Creating the client restores an
  // existing session silently from Auth0's session cookie.
  const client = await createAuth0Client({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });
  await handleRedirect(client);
  return client;
}

// One client per page load, created on first use.
function getClient(): Promise<Auth0Client> {
  clientPromise ??= bootstrap();
  return clientPromise;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getClient()).isAuthenticated();
}

export async function getUser(): Promise<User | undefined> {
  return (await getClient()).getUser();
}

// Redirect to Auth0 to log in, returning to `returnTo` afterwards.
export async function login(
  returnTo: string = window.location.pathname,
): Promise<void> {
  const client = await getClient();
  await client.loginWithRedirect<AppState>({ appState: { returnTo } });
}

export async function logout(): Promise<void> {
  const client = await getClient();
  await client.logout({ logoutParams: { returnTo: window.location.origin } });
}
