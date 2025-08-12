import type { PublicClientFetch } from ".";

/**
 * https://public.com/api/docs/resources/account-details/get-history
 */
export type PublicGetAccountHistoryOptions = {
  /**
   * Start timestamp in ISO 8601 format with timezone. Example:
   * 2025-01-15T09:00:00-05:00 (9 AM EST, New York time). Formated
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  start?: string;
  /**
   * End timestamp in ISO 8601 format with timezone. Example:
   * 2025-04-10T09:00:00-04:00 (9 AM EDT, New York time). Formated
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  end?: string;
  /**
   * Maximum number of records to return.
   */
  pageSize?: number;
  /**
   * Pagination token for fetching the next result set.
   */
  nextToken?: string;
};

export function listAccounts(fetch: PublicClientFetch) {
  return fetch<{
    accounts: any[];
  }>("/trading/account");
}

export function getAccount(fetch: PublicClientFetch, accountId: string) {
  return fetch<any>(`/trading/${accountId}/portfolio/v2`);
}

export function getAccountHistory(
  fetch: PublicClientFetch,
  accountId: string,
  options: PublicGetAccountHistoryOptions = {}
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      params.set(key, value.toString());
    }
  }

  const stringParams = params.toString();
  return fetch<{
    history: any[];
  }>(
    `/trading/${accountId}/history${
      stringParams.length > 0 ? `?${stringParams}` : ""
    }`
  );
}
