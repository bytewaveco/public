import type { PublicClientFetch } from '.'

export type PublicInstrumentType =
  | 'EQUITY'
  | 'OPTION'
  | 'MULTI_LEG_INSTRUMENT'
  | 'CRYPTO'
  | 'ALT'
  | 'TREASURY'
  | 'BOND'
  | 'INDEX'

export type PublicTradingState =
  | 'BUY_AND_SELL'
  | 'LIQUIDATION_ONLY'
  | 'DISABLED'

/**
 * https://public.com/api/docs/resources/instrument-details/get-instrument
 */
export type PublicInstrument = {
  symbol: string
  type: PublicInstrumentType
}

/**
 * https://public.com/api/docs/resources/instrument-details/get-all-instruments
 */
export type PublicGetInstrumentsOptions = {
  /**
   * Optional set of security types to filter by ([GatewaySecurityType])
   */
  typeFilter?: PublicInstrumentType[]
  /**
   * Optional set of trading statuses to filter by ([ApiInstrumentDto.Trading])
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  tradingFilter?: any[]
  /**
   * Optional set of fractional trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fractionalTradingFilter?: any[]
  /**
   * Optional set of option trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  optionTradingFilter?: any[]
  /**
   * Optional set of option spread trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  optionSpreadTradingFilter?: any[]
}

export class InstrumentsApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * Get all instruments.
   *
   * https://public.com/api/docs/resources/instrument-details/get-all-instruments
   *
   * @returns The instruments available on Public.
   */
  async getInstruments(options: PublicGetInstrumentsOptions = {}) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        params.set(key, value.toString())
      }
    }

    const stringParams = params.toString()
    return this.fetch<{
      instruments: {
        instrument: PublicInstrument
        trading: PublicTradingState
        fractionalTrading: PublicTradingState
        optionTrading: PublicTradingState
        optionSpreadTrading: PublicTradingState
      }[]
    }>(
      `/trading/instruments${stringParams.length > 0 ? `?${stringParams}` : ''}`,
    )
  }

  /**
   * Get the instrument details for a given symbol and type.
   *
   * https://public.com/api/docs/resources/instrument-details/get-instrument-details
   *
   * @param symbol - The symbol of the instrument to get the details for.
   * @param type - The type of the instrument to get the details for.
   *
   * @returns The instrument details for the given symbol and type.
   */
  async getInstrument(symbol: string, type: PublicInstrumentType) {
    return this.fetch<{
      instrument: PublicInstrument
      trading: PublicTradingState
      fractionalTrading: PublicTradingState
      optionTrading: PublicTradingState
      optionSpreadTrading: PublicTradingState
    }>(`/trading/instruments/${symbol}/${type}`)
  }
}
