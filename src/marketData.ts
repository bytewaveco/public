import type { PublicClientFetch } from '.'
import type { PublicInstrument } from './instruments'

export class MarketDataApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * Get the quotes for given instruments.
   *
   * https://public.com/api/docs/resources/market-data/get-quotes
   *
   * @param accountId - The ID of the account to get the quotes for.
   * @param instruments - The instruments to get the quotes for.
   *
   * @returns The quotes for the given instruments.
   */
  async getQuotes(
    accountId: string,
    instruments: PublicInstrument[],
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: { quotes: any[] } | null
    error: Error | null
  }> {
    return this.fetch(`/marketdata/${accountId}/quotes`, {
      method: 'POST',
      body: JSON.stringify({
        instruments,
      }),
    })
  }
}
