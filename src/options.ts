import type { PublicClientFetch } from '.'
import type { PublicInstrument } from './instruments'

export class OptionsApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * Get the option greeks for a given option symbol.
   *
   * https://public.com/api/docs/resources/option-details/get-option-greeks
   *
   * @param accountId - The ID of the account to get the option greeks for.
   * @param osiOptionSymbol - The option symbol to get the greeks for.
   *
   * @returns The option greeks for the given option symbol.
   */
  async getOptionGreeks(accountId: string, osiOptionSymbol: string) {
    return this.fetch<{
      delta: string
      gamma: string
      theta: string
      vega: string
      rho: string
      impliedVolatility: string
    }>(`/option-details/${accountId}/${osiOptionSymbol}/greeks`)
  }

  /**
   * Get the option expirations for a given instrument.
   *
   * https://public.com/api/docs/resources/market-data/get-option-expirations
   *
   * @param accountId - The ID of the account to get the option expirations for.
   * @param instrument - The instrument to get the option expirations for.
   *
   * @returns The option expirations for the given instrument.
   */
  async getOptionExpirations(accountId: string, instrument: PublicInstrument) {
    return this.fetch<{
      baseSymbol: string
      expirations: string[]
    }>(`/marketdata/${accountId}/option-expirations`, {
      method: 'POST',
      body: JSON.stringify({
        instrument,
      }),
    })
  }

  /**
   * Get the option chain for a given instrument and expiration date.
   *
   * https://public.com/api/docs/resources/market-data/get-option-chain
   *
   * @param accountId - The ID of the account to get the option chain for.
   * @param instrument - The instrument to get the option chain for.
   * @param expirationDate - The expiration date to get the option chain for.
   *
   * @returns The option chain for the given instrument and expiration date.
   */
  async getOptionChain(
    accountId: string,
    instrument: PublicInstrument,
    expirationDate: string,
  ) {
    return this.fetch<{
      baseSymbol: string
      calls: {
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
      puts: {
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
    }>(`/marketdata/${accountId}/option-chain`, {
      method: 'POST',
      body: JSON.stringify({
        instrument,
        expirationDate,
      }),
    })
  }
}
