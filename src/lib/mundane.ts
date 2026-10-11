import { getAccessToken } from "./auth";

// Client for the Mundane API (letsbuilda/mundane-backend). Every call carries
// the signed-in player's access token; games belong to whoever created them.
const apiUrl = import.meta.env.PUBLIC_MUNDANE_API_URL;

if (!apiUrl) {
  throw new Error("Missing Mundane configuration. Set PUBLIC_MUNDANE_API_URL.");
}

export interface Player {
  name: string;
  composure: number;
  time: number;
  hand: string[];
  board: string[];
  deck: string[];
  discard: string[];
}

export interface StackItem {
  id: number;
  card_id: string;
  controller: number;
  target_id: number | null;
}

export interface GameState {
  players: Player[];
  active_player: number;
  priority_player: number;
  phase: string;
  stack: StackItem[];
  turn: number;
  winner: number | null;
}

export type Action =
  | { type: "play_card"; player: number; hand_index: number }
  | {
      type: "cast_instant";
      player: number;
      hand_index: number;
      target_id?: number | null;
    }
  | { type: "pass_priority"; player: number };

// The API's error body (`detail`) is the reason a move was refused.
export class MundaneError extends Error {
  constructor(
    readonly status: number,
    detail: string,
  ) {
    super(detail);
  }
}

async function call<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${await getAccessToken()}`,
  };
  const init: RequestInit = { method: body === undefined ? "GET" : "POST" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  init.headers = headers;

  const response = await fetch(`${apiUrl}${path}`, init);
  const payload: unknown = await response.json();
  if (!response.ok) {
    const detail = (payload as { detail?: string }).detail;
    throw new MundaneError(response.status, detail ?? "Request failed");
  }
  return payload as T;
}

export function createGame(): Promise<{ game_id: string; state: GameState }> {
  return call("/games", {});
}

export function readGame(gameId: string): Promise<GameState> {
  return call(`/games/${encodeURIComponent(gameId)}`);
}

export function submitAction(
  gameId: string,
  action: Action,
): Promise<GameState> {
  return call(`/games/${encodeURIComponent(gameId)}/actions`, action);
}
