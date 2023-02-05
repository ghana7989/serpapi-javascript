import type { EngineMap } from "./engines/engine_map.ts";
import { version } from "../version.ts";

type UrlParameters = Record<
  string,
  string | number | boolean | undefined | null
>;

/**
 * This `_internals` object is needed to support stubbing/spying of
 * fetch, execute and getBaseUrl.
 * https://deno.land/manual@v1.28.3/basics/testing/mocking
 *
 * If fetch is stubbed via `globalThis`, the test phase of the npm build fails.
 * ```ts
 * const fetchStub = stub(globalThis, "fetch", resolvesNext([new Response("data")]));
 * ```
 *
 * [`dnt`](https://github.com/denoland/dnt) shims `fetch` by relying on the
 * `undici` package. It replaces all references to `fetch` with `dntShim.fetch`.
 * As a side effect, stubbing `globalThis.fetch` becomes incorrect; we want to
 * stub `dntShim.fetch` instead.
 *
 * As a workaround, the `_internals` object serves as an indirection and we
 * stub the `fetch` key of this object instead.
 */
export const _internals = {
  fetch: fetch,
  execute: execute,
  getBaseUrl: getBaseUrl,
};

/** Facilitates stubbing in tests, e.g. localhost as the base url */
function getBaseUrl() {
  return "https://serpapi.com";
}

type NextParametersKeys<E extends keyof EngineMap> = Omit<
  EngineMap[E]["parameters"],
  "api_key" | "no_cache" | "async" | "timeout"
>;
type NextParameters<E extends keyof EngineMap> = {
  [K in keyof NextParametersKeys<E>]: string;
};
export function extractNextParameters<
  E extends keyof EngineMap,
>(json: {
  serpapi_pagination?: { next: string };
  pagination?: { next: string };
}) {
  const nextUrlString = json["serpapi_pagination"]?.["next"] ||
    json["pagination"]?.["next"];

  if (nextUrlString) {
    const nextUrl = new URL(nextUrlString);
    const nextParameters = Object.fromEntries(nextUrl.searchParams.entries());
    delete nextParameters["engine"];
    return nextParameters as NextParameters<E>;
  }
}

export function haveParametersChanged(
  parameters: Record<string, unknown>,
  nextParameters: Record<string, unknown>,
) {
  const keys = [
    ...Object.keys(parameters),
    ...Object.keys(nextParameters),
  ];
  const uniqueKeys = new Set(keys);
  return [...uniqueKeys].some((key) =>
    `${parameters[key]}` !== `${nextParameters[key]}` // string comparison
  );
}

function getSource() {
  const moduleSource = `serpapi@${version}`;
  try {
    // Check if running in Node.js
    // deno-lint-ignore no-explicit-any
    if ((globalThis as any)?.process?.version) {
      // deno-lint-ignore no-explicit-any
      const nodeVersion = (globalThis as any).process.version.replace("v", "");
      return `nodejs@${nodeVersion},${moduleSource}`;
    }

    // Assumes running in Deno instead
    return `deno@${Deno.version.deno},${moduleSource}`;
  } catch {
    // If something unexpectedly occurs, revert to "nodejs".
    return `nodejs,${moduleSource}`;
  }
}

export function buildUrl<P extends UrlParameters>(
  path: string,
  parameters: P,
): string {
  const nonUndefinedParams: [string, string][] = Object.entries(parameters)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => [key, `${value}`]);
  const searchParams = new URLSearchParams(nonUndefinedParams);
  return `${_internals.getBaseUrl()}${path}?${searchParams}`;
}

export async function execute<P extends UrlParameters>(
  path: string,
  parameters: P,
  timeout: number,
) {

  const url = buildUrl(path, {
    ...parameters,
    source: getSource(),
  });

  const controller = new AbortController();

  const signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
    console.error('Request timed out');
  }, timeout);

  return _internals.fetch(url, {
    signal,
  }).then((response) => {
    clearTimeout(timeoutId);
    return response
  });
}
