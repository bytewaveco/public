import type { PublicClientFetch } from ".";
import type { PublicInstrument } from "./instruments";

export class MarketDataApi {
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
    instruments: PublicInstrument[]
  ): Promise<{
    data: { quotes: any[] } | null;
    error: Error | null;
  }> {
    return this.fetch(`/marketdata/${accountId}/quotes`, {
      method: "POST",
      body: JSON.stringify({
        instruments,
      }),
    });
  }
}
