import type { PublicClientFetch } from ".";

export type PublicGetAccountHistoryOptions = {
  start?: string;
  end?: string;
  pageSize?: number;
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
