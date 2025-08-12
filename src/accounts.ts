import type { PublicClientFetch } from '.'

/**
 * https://public.com/api/docs/resources/account-details/get-history
 */
export type PublicGetAccountHistoryOptions = {
  /**
   * Start timestamp in ISO 8601 format with timezone. Example:
   * 2025-01-15T09:00:00-05:00 (9 AM EST, New York time). Formatted
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  start?: string
  /**
   * End timestamp in ISO 8601 format with timezone. Example:
   * 2025-04-10T09:00:00-04:00 (9 AM EDT, New York time). Formatted
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  end?: string
  /**
   * Maximum number of records to return.
   */
  pageSize?: number
  /**
   * Pagination token for fetching the next result set.
   */
  nextToken?: string
}

export class AccountsApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * List all accounts for the current user.
   *
   * https://public.com/api/docs/resources/list-accounts/get-accounts
   *
   * @returns The list of accounts.
   */
  async listAccounts(): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: { accounts: any[] } | null
    error: Error | null
  }> {
    return this.fetch('/trading/account')
  }

  /**
   * Get the account details for a given account.
   *
   * https://public.com/api/docs/resources/account-details/get-account-portfolio-v2
   *
   * @param accountId - The ID of the account to get the portfolio for.
   *
   * @returns The account details for the given account.
   */
  async getAccount(accountId: string): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/portfolio/v2`)
  }

  /**
   * Get the account history for a given account.
   *
   * https://public.com/api/docs/resources/account-details/get-history
   *
   * @param accountId - The ID of the account to get the history for.
   * @param options - The options to use for the request.
   *
   * @returns The account history for the given account.
   */
  getAccountHistory(
    accountId: string,
    options: PublicGetAccountHistoryOptions = {},
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: { history: any[] } | null
    error: Error | null
  }> {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        params.set(key, value.toString())
      }
    }

    const stringParams = params.toString()

    return this.fetch(
      `/trading/${accountId}/history${
        stringParams.length > 0 ? `?${stringParams}` : ''
      }`,
    )
  }
}
