import type { PublicClientFetch } from ".";

export type PublicInstrumentType =
  | "EQUITY"
  | "OPTION"
  | "MULTI_LEG_INSTRUMENT"
  | "CRYPTO"
  | "ALT"
  | "TREASURY"
  | "BOND"
  | "INDEX";

/**
 * https://public.com/api/docs/resources/instrument-details/get-instrument
 */
export type PublicInstrument = {
  symbol: string;
  type: PublicInstrumentType;
};

/**
 * https://public.com/api/docs/resources/instrument-details/get-all-instruments
 */
export type PublicGetInstrumentsOptions = {
  /**
   * Optional set of security types to filter by ([GatewaySecurityType])
   */
  typeFilter?: PublicInstrumentType[];
  /**
   * Optional set of trading statuses to filter by ([ApiInstrumentDto.Trading])
   */
  tradingFilter?: any[];
  /**
   * Optional set of fractional trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  fractionalTradingFilter?: any[];
  /**
   * Optional set of option trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  optionTradingFilter?: any[];
  /**
   * Optional set of option spread trading statuses to filter by
   * ([ApiInstrumentDto.Trading])
   */
  optionSpreadTradingFilter?: any[];
};

export class InstrumentsApi {
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * Get all instruments.
   *
   * https://public.com/api/docs/resources/instrument-details/get-all-instruments
   *
   * @returns The instruments available on Public.
   */
  async getInstruments(
    options: PublicGetInstrumentsOptions = {}
  ): Promise<{
    data: { instruments: any[] } | null;
    error: Error | null;
  }> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    }

    const stringParams = params.toString();
    return this.fetch(
      `/trading/instruments${stringParams.length > 0 ? `?${stringParams}` : ""}`
    );
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
  async getInstrument(
    symbol: string,
    type: PublicInstrumentType
  ): Promise<{
    data: any | null;
    error: Error | null;
  }> {
    return this.fetch(`/trading/instruments/${symbol}/${type}`);
  }
}
