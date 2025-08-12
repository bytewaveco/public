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
  async getOptionGreeks(
    accountId: string,
    osiOptionSymbol: string,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/option-details/${accountId}/${osiOptionSymbol}/greeks`)
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
  async getOptionExpirations(
    accountId: string,
    instrument: PublicInstrument,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/marketdata/${accountId}/option-expirations`, {
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
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/marketdata/${accountId}/option-chain`, {
      method: 'POST',
      body: JSON.stringify({
        instrument,
        expirationDate,
      }),
    })
  }
}
