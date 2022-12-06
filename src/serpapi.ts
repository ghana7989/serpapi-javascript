import { execute, validateApiKey, validateTimeout } from "./utils.ts";

export type AccountApiParams = {
  api_key?: string;
  timeout?: number;
};
export type AccountInformation = {
  account_email: string;
  account_id: string;
  account_rate_limit_per_hour: number;
  api_key: string;
  extra_credits: number;
  last_hour_searches: number;
  plan_id: string;
  plan_name: string;
  plan_searches_left: number;
  searches_per_month: number;
  this_hour_searches: number;
  this_month_usage: number;
  total_searches_left: number;
};

export type LocationsApiParams = {
  q?: string;
  limit?: number;
  timeout?: number;
};
export type Location = {
  canonical_name: string;
  country_code: string;
  google_id: number;
  google_parent_id: number;
  gps: [number, number];
  id: string;
  keys: string[];
  name: string;
  reach: number;
  target_type: string;
};
export type Locations = Location[];

const ACCOUNT_PATH = "/account";
const LOCATIONS_PATH = "/locations.json";

/**
 * Get account information of an API key.
 * https://serpapi.com/account-api
 *
 * ```ts
 * // async/await
 * const info = await getAccount({ api_key: API_KEY });
 *
 * // callback
 * getAccount({ api_key: API_KEY }, console.log);
 * ```
 */
export async function getAccount(
  parameters: AccountApiParams = {},
  callback?: (info: AccountInformation) => void,
) {
  const apiKey = validateApiKey(parameters.api_key);
  const timeout = validateTimeout(parameters.timeout);
  const response = await execute(ACCOUNT_PATH, {
    api_key: apiKey,
  }, timeout);
  const info = await response.json() as AccountInformation;
  callback?.(info);
  return info;
}

/**
 * Get supported locations.
 * https://serpapi.com/locations-api
 *
 * ```ts
 * // async/await
 * const locations = await getLocations({ limit: 3 });
 *
 * // callback
 * getLocations({ limit: 3 }, console.log);
 * ```
 */
export async function getLocations(
  parameters: LocationsApiParams = {},
  callback?: (locations: Locations) => void,
) {
  const timeout = validateTimeout(parameters.timeout);
  const response = await execute(
    LOCATIONS_PATH,
    parameters,
    timeout,
  );
  const locations = await response.json() as Locations;
  callback?.(locations);
  return locations;
}
