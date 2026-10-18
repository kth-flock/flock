export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string>;
  fallbackError?: string;
  nullOn?: number[];
};

async function request(
  path: string,
  opts: RequestOptions,
): Promise<Response | null> {
  const { method = "GET", body, query, fallbackError, nullOn } = opts;
  const isForm = body instanceof FormData;
  const qs = query ? `?${new URLSearchParams(query)}` : "";

  const res = await fetch(`${API_BASE_URL}${path}${qs}`, {
    method,
    credentials: "include",
    headers:
      body !== undefined && !isForm
        ? { "Content-Type": "application/json" }
        : undefined,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (nullOn?.includes(res.status)) return null;

  if (!res.ok) {
    const payload: { error?: string } = await res.json().catch(() => ({}));
    throw new ApiError(
      payload.error ?? fallbackError ?? `Request to ${path} failed`,
      res.status,
    );
  }
  return res;
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function apiFetch<T = void>(
  path: string,
  opts: RequestOptions = {},
) {
  const res = await request(path, { ...opts, nullOn: undefined });
  return parse<T>(res!);
}

export async function apiData<T>(path: string, opts: RequestOptions = {}) {
  const res = await request(path, { ...opts, nullOn: undefined });
  return (await parse<{ data: T }>(res!)).data;
}

export async function apiDataOrNull<T>(
  path: string,
  opts: RequestOptions & { nullOn: number[] },
) {
  const res = await request(path, opts);
  return res ? (await parse<{ data: T }>(res)).data : null;
}
