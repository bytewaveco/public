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

export type PublicInstrument = {
  symbol: string;
  type: PublicInstrumentType;
};

export type PublicGetInstrumentsOptions = {
  typeFilter?: PublicInstrumentType[];
  // TODO: add types
  tradingFilter?: any[];
  fractionalTradingFilter?: any[];
  optionTradingFilter?: any[];
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