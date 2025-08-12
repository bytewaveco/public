import type { PublicClientFetch } from ".";
import type { PublicInstrumentType } from "./instruments";

export async function getQuotes(
  fetch: PublicClientFetch,
  accountId: string,
  instruments: {
    symbol: string;
    type: PublicInstrumentType;
  }[]
) {
  return fetch<{
    quotes: any[];
  }>(`/marketdata/${accountId}/quotes`, {
    method: "POST",
    body: JSON.stringify({
      instruments,
    }),
  });
}
