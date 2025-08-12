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

export function getInstruments(
  fetch: PublicClientFetch,
  options: PublicGetInstrumentsOptions = {}
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      params.set(key, value.toString());
    }
  }

  const stringParams = params.toString();
  return fetch<{
    instruments: any[];
  }>(
    `/trading/instruments${stringParams.length > 0 ? `?${stringParams}` : ""}`
  );
}

export function getInstrument(
  fetch: PublicClientFetch,
  symbol: string,
  type: PublicInstrumentType
) {
  return fetch<any>(`/trading/instruments/${symbol}/${type}`);
}
