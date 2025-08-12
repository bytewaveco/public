import type { PublicClientFetch } from ".";
import type { PublicInstrument } from "./instruments";

export function getOptionGreeks(
  fetch: PublicClientFetch,
  accountId: string,
  osiOptionSymbol: string,
) {
  return fetch<any>(`/option-details/${accountId}/${osiOptionSymbol}/greeks`);
}

export function getOptionExpirations(
  fetch: PublicClientFetch,
  accountId: string,
  instrument: PublicInstrument,
) {
  return fetch<any>(`/marketdata/${accountId}/option-expirations`, {
    method: "POST",
    body: JSON.stringify({
      instrument,
    }),
  });
}

export function getOptionChain(
  fetch: PublicClientFetch,
  accountId: string,
  instrument: PublicInstrument,
  expirationDate: string,
) {
  return fetch<any>(`/marketdata/${accountId}/option-chain`, {
    method: "POST",
    body: JSON.stringify({
      instrument,
      expirationDate,
    }),
  });
}