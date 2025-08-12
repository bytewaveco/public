import type { PublicClientFetch, PublicInstrument } from ".";
import { v4 } from "uuid";

export type PublicOrderSide = "BUY" | "SELL";

export type PublicOrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";

export type PublicOpenCloseIndicator = "OPEN" | "CLOSE";

export type PublicTimeInForce = "DAY" | "GTD";

/**
 * https://public.com/api/docs/resources/order-placement/preflight-single-leg
 */
export type PublicPlaceOrderOptions = {
  /**
   * The OrderId, a UUID conforming to RFC 4122 (standard 8-4-4-4-12 format,
   * e.g., 0d2abd8d-3625-4c83-a806-98abf35567cc), must be globally unique over
   * time. This value serves as the deduplication key; if reused on the same
   * account, the operation is idempotent. If the order is re-submitted due to a
   * read timeout, do not modify any properties. If the original request
   * succeeded, altering fields will have no effect.
   */
  orderId: string;
  instrument: PublicInstrument;
  /**
   * The Order Side BUY/SELL. For Options also include the openCloseIndicator
   */
  orderSide: PublicOrderSide;
  /**
   * The Type of order
   */
  orderType: PublicOrderType;
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce;
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string;
  };
  /**
   * The order quantity. Used when buying/selling whole shares and when selling
   * fractional. Mutually exclusive with `amount`
   */
  quantity?: string;
  /**
   * The order amount. Used when buying/selling shares for a specific notional
   * value
   */
  amount?: string;
  /**
   * The limit price. Used when orderType = LIMIT or orderType = STOP_LIMIT
   */
  limitPrice?: string;
  /**
   * The stop price. Used when orderType = STOP or orderType = STOP_LIMIT
   */
  stopPrice?: string;
  /**
   * Used for options only. Indicates if this is BUY to OPEN/CLOSE
   */
  openCloseIndicator?: PublicOpenCloseIndicator;
};

/**
 * https://public.com/api/docs/resources/order-placement/place-multileg-order
 */
export type PublicPlaceOrderMultiLegOptions = {
  /**
   * The OrderId, a UUID conforming to RFC 4122 (standard 8-4-4-4-12 format,
   * e.g., 0d2abd8d-3625-4c83-a806-98abf35567cc), must be globally unique over
   * time. This value serves as the deduplication key; if reused on the same
   * account, the operation is idempotent. If the order is re-submitted due to a
   * read timeout, do not modify any properties. If the original request
   * succeeded, altering fields will have no effect.
   */
  orderId: string;
  /**
   * The order quantity
   */
  quantity: string;
  /**
   * The order type. Only LIMIT order are allowed
   */
  type: "LIMIT";
  /**
   * The limit price for the order. For debit spreads the limit price must be
   * positive, for create spreads the limit price is negative
   */
  limitPrice: string;
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce;
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string;
  };
  /**
   * From 2-6 legs. There can be at most 1 equity leg
   */
  legs: {
    instrument: PublicInstrument;
    side: PublicOrderSide;
    /**
     * Required when instrument.type = OPTION, used to determine if the leg is
     * buy-to-open or buy-to-close
     */
    openCloseIndicator?: PublicOpenCloseIndicator;
    /**
     * The ratio between legs. Equity legs will typically be 100 shares, and
     * option legs 1 contract
     */
    ratioQuantity?: number;
  }[];
};

/**
 * https://public.com/api/docs/resources/order-placement/preflight-single-leg
 */
export type PublicPreflightSingleLegOptions = {
  instrument: PublicInstrument;
  /**
   * The Order Side BUY/SELL. For Options also include the openCloseIndicator
   */
  orderSide: PublicOrderSide;
  /**
   * The Type of order
   */
  orderType: PublicOrderType;
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce;
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string;
  };
  /**
   * The order quantity. Used when buying/selling whole shares and when selling
   * fractional. Mutually exclusive with `amount`
   */
  quantity?: string;
  /**
   * The order amount. Used when buying/selling shares for a specific notional
   * value
   */
  amount?: string;
  /**
   * The limit price. Used when orderType = LIMIT or orderType = STOP_LIMIT
   */
  limitPrice?: string;
  /**
   * The stop price. Used when orderType = STOP or orderType = STOP_LIMIT
   */
  stopPrice?: string;
  /**
   * Used for options only. Indicates if this is BUY to OPEN/CLOSE
   */
  openCloseIndicator?: PublicOpenCloseIndicator;
};

/**
 * https://public.com/api/docs/resources/order-placement/preflight-multi-leg
 */
export type PublicPreflightMultiLegOptions = {
  /**
   * The Type of order
   */
  orderType: PublicOrderType;
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce;
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string;
  };
  /**
   * The order quantity
   */
  quantity?: string;
  /**
   * The limit price for the order. For debit spreads the limit price must be
   * positive, for create spreads the limit price is negative
   */
  limitPrice: string;
  /**
   * From 2-6 legs. There can be at most 1 equity leg
   */
  legs: {
    instrument: PublicInstrument;
    side: PublicOrderSide;
    /**
     * Required when instrument.type = OPTION, used to determine if the leg is
     * buy-to-open or buy-to-close
     */
    openCloseIndicator?: PublicOpenCloseIndicator;
    /**
     * The ratio between legs. Equity legs will typically be 100 shares, and
     * option legs 1 contract
     */
    ratioQuantity?: number;
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

export function createOrderId() {
  return v4();
}
