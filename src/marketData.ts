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
  async getQuotes(accountId: string, instruments: PublicInstrument[]) {
    return this.fetch<{
      quotes: {
        instrument: PublicInstrument
        outcome: 'SUCCESS' | 'UNKNOWN'
        last: string
        lastTimestamp: string
        bid: string
        bidSize: number
        bidTimestamp: string
        ask: string
        askSize: number
        askTimestamp: string
        volume: number
        openInterest: number
      }[]
    }>(`/marketdata/${accountId}/quotes`, {
      method: 'POST',
      body: JSON.stringify({
        instruments,
      }),
    })
  }
}
