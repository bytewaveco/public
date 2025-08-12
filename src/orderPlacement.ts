import type { PublicClientFetch, PublicInstrument } from ".";

export type PublicPlaceOrderOptions = {
  orderId: string;
  instrument: PublicInstrument;
  orderSide: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
  expiration: {
    timeInForce: "DAY" | "GTD";
    expirationTime: string;
  };
  quantity?: string;
  amount?: string;
  stopPrice?: string;
  limitPrice?: string;
  openCloseIndicator?: "OPEN" | "CLOSE";
};

export type PublicPlaceOrderMultiLegOptions = {
  orderId: string;
  quantity: string;
  type: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
  limitPrice: string;
  expiration: {
    timeInForce: "DAY" | "GTD";
    expirationTime: string;
  };
  legs: {
    instrument: PublicInstrument;
    side: "BUY" | "SELL";
    openCloseIndicator?: "OPEN" | "CLOSE";
    ratioQuantity: number;
  }[];
};

export type PublicPreflightSingleLegOptions = {
  instrument: PublicInstrument;
  orderSide: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
  expiration: {
    timeInForce: "DAY" | "GTD";
    expirationTime: string;
  };
  quantity?: string;
  amount?: string;
  limitPrice?: string;
  stopPrice?: string;
  openCloseIndicator?: "OPEN" | "CLOSE";
};

export type PublicPreflightMultiLegOptions = {
  orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
  expiration: {
    timeInForce: "DAY" | "GTD";
    expirationTime: string;
  };
  quantity: string;
  limitPrice: string;
  legs: {
    instrument: PublicInstrument;
    side: "BUY" | "SELL";
    openCloseIndicator?: "OPEN" | "CLOSE";
    ratioQuantity: number;
  }[];
};

export function placeOrder(
  fetch: PublicClientFetch,
  accountId: string,
  options: PublicPlaceOrderOptions
) {
  return fetch<any>(`/trading/${accountId}/order`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}

export function placeOrderMultiLeg(
  fetch: PublicClientFetch,
  accountId: string,
  options: PublicPlaceOrderMultiLegOptions
) {
  return fetch<any>(`/trading/${accountId}/order/multileg`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}

export function getOrder(
  fetch: PublicClientFetch,
  accountId: string,
  orderId: string
) {
  return fetch<any>(`/trading/${accountId}/order/${orderId}`);
}

export function cancelOrder(
  fetch: PublicClientFetch,
  accountId: string,
  orderId: string
) {
  return fetch<any>(`/trading/${accountId}/order/${orderId}`, {
    method: "DELETE",
  });
}

export function preflightSingleLeg(
  fetch: PublicClientFetch,
  accountId: string,
  options: PublicPreflightSingleLegOptions
) {
  return fetch<any>(`/trading/${accountId}/preflight/single-leg`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}

export function preflightMultiLeg(
  fetch: PublicClientFetch,
  accountId: string,
  options: PublicPreflightMultiLegOptions
) {
  return fetch<any>(`/trading/${accountId}/preflight/multi-leg`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}
