import type { PublicClientFetch, PublicInstrument } from '.'
import { v4 } from 'uuid'

export type PublicOrderSide = 'BUY' | 'SELL'

export type PublicOrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT'

export type PublicOpenCloseIndicator = 'OPEN' | 'CLOSE'

export type PublicTimeInForce = 'DAY' | 'GTD'

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
  orderId: string
  instrument: PublicInstrument
  /**
   * The Order Side BUY/SELL. For Options also include the openCloseIndicator
   */
  orderSide: PublicOrderSide
  /**
   * The Type of order
   */
  orderType: PublicOrderType
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string
  }
  /**
   * The order quantity. Used when buying/selling whole shares and when selling
   * fractional. Mutually exclusive with `amount`
   */
  quantity?: string
  /**
   * The order amount. Used when buying/selling shares for a specific notional
   * value
   */
  amount?: string
  /**
   * The limit price. Used when orderType = LIMIT or orderType = STOP_LIMIT
   */
  limitPrice?: string
  /**
   * The stop price. Used when orderType = STOP or orderType = STOP_LIMIT
   */
  stopPrice?: string
  /**
   * Used for options only. Indicates if this is BUY to OPEN/CLOSE
   */
  openCloseIndicator?: PublicOpenCloseIndicator
}

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
  orderId: string
  /**
   * The order quantity
   */
  quantity: string
  /**
   * The order type. Only LIMIT order are allowed
   */
  type: 'LIMIT'
  /**
   * The limit price for the order. For debit spreads the limit price must be
   * positive, for create spreads the limit price is negative
   */
  limitPrice: string
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string
  }
  /**
   * From 2-6 legs. There can be at most 1 equity leg
   */
  legs: {
    instrument: PublicInstrument
    side: PublicOrderSide
    /**
     * Required when instrument.type = OPTION, used to determine if the leg is
     * buy-to-open or buy-to-close
     */
    openCloseIndicator?: PublicOpenCloseIndicator
    /**
     * The ratio between legs. Equity legs will typically be 100 shares, and
     * option legs 1 contract
     */
    ratioQuantity?: number
  }[]
}

/**
 * https://public.com/api/docs/resources/order-placement/preflight-single-leg
 */
export type PublicPreflightSingleLegOptions = {
  instrument: PublicInstrument
  /**
   * The Order Side BUY/SELL. For Options also include the openCloseIndicator
   */
  orderSide: PublicOrderSide
  /**
   * The Type of order
   */
  orderType: PublicOrderType
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string
  }
  /**
   * The order quantity. Used when buying/selling whole shares and when selling
   * fractional. Mutually exclusive with `amount`
   */
  quantity?: string
  /**
   * The order amount. Used when buying/selling shares for a specific notional
   * value
   */
  amount?: string
  /**
   * The limit price. Used when orderType = LIMIT or orderType = STOP_LIMIT
   */
  limitPrice?: string
  /**
   * The stop price. Used when orderType = STOP or orderType = STOP_LIMIT
   */
  stopPrice?: string
  /**
   * Used for options only. Indicates if this is BUY to OPEN/CLOSE
   */
  openCloseIndicator?: PublicOpenCloseIndicator
}

/**
 * https://public.com/api/docs/resources/order-placement/preflight-multi-leg
 */
export type PublicPreflightMultiLegOptions = {
  /**
   * The Type of order
   */
  orderType: PublicOrderType
  expiration: {
    /**
     * The time in for the order
     */
    timeInForce: PublicTimeInForce
    /**
     * The expiration date. Only used when timeInForce is GTD, cannot be more
     * than 90 days in the future
     */
    expirationTime: string
  }
  /**
   * The order quantity
   */
  quantity?: string
  /**
   * The limit price for the order. For debit spreads the limit price must be
   * positive, for create spreads the limit price is negative
   */
  limitPrice: string
  /**
   * From 2-6 legs. There can be at most 1 equity leg
   */
  legs: {
    instrument: PublicInstrument
    side: PublicOrderSide
    /**
     * Required when instrument.type = OPTION, used to determine if the leg is
     * buy-to-open or buy-to-close
     */
    openCloseIndicator?: PublicOpenCloseIndicator
    /**
     * The ratio between legs. Equity legs will typically be 100 shares, and
     * option legs 1 contract
     */
    ratioQuantity?: number
  }[]
}

export class OrderPlacementApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * Create a UUID conforming to RFC 4122 (standard 8-4-4-4-12 format, e.g.,
   * 0d2abd8d-3625-4c83-a806-98abf35567cc), must be globally unique over time.
   * This value serves as the deduplication key; if reused on the same account,
   * the operation is idempotent. If the order is re-submitted due to a read
   * timeout, do not modify any properties. If the original request succeeded,
   * altering fields will have no effect.
   *
   * @returns A new order ID.
   */
  createOrderId() {
    return v4()
  }

  /**
   * Place an order for a given account.
   *
   * https://public.com/api/docs/resources/order-placement/place-order
   *
   * @param accountId - The ID of the account to place the order for.
   * @param options - The options for the order.
   *
   * @returns The order details for the given order.
   */
  async placeOrder(
    accountId: string,
    options: PublicPlaceOrderOptions,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/order`, {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Place a multi leg order for a given account.
   *
   * https://public.com/api/docs/resources/order-placement/place-order-multileg
   *
   * @param accountId - The ID of the account to place the order for.
   * @param options - The options for the order.
   *
   * @returns The order details for the given order.
   */
  async placeOrderMultiLeg(
    accountId: string,
    options: PublicPlaceOrderMultiLegOptions,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/order/multileg`, {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Preflight a single leg order.
   *
   * https://public.com/api/docs/resources/order-placement/preflight-single-leg
   *
   * @param accountId - The ID of the account to preflight the order for.
   * @param options - The options for the preflight.
   *
   * @returns The preflight result.
   */
  async preflightSingleLeg(
    accountId: string,
    options: PublicPreflightSingleLegOptions,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/preflight/single-leg`, {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Preflight a multi leg order.
   *
   * https://public.com/api/docs/resources/order-placement/preflight-multi-leg
   *
   * @param accountId - The ID of the account to preflight the order for.
   * @param options - The options for the preflight.
   *
   * @returns The preflight result.
   */
  async preflightMultiLeg(
    accountId: string,
    options: PublicPreflightMultiLegOptions,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/preflight/multi-leg`, {
      method: 'POST',
      body: JSON.stringify(options),
    })
  }

  /**
   * Get the order details for a given order.
   *
   * https://public.com/api/docs/resources/order-placement/get-order
   *
   * @param accountId - The ID of the account to get the order for.
   * @param orderId - The ID of the order to get the details for.
   *
   * @returns The order details for the given order.
   */
  async getOrder(
    accountId: string,
    orderId: string,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/order/${orderId}`)
  }

  /**
   * Cancel an order for a given account.
   *
   * https://public.com/api/docs/resources/order-placement/cancel-order
   *
   * @param accountId - The ID of the account to cancel the order for.
   * @param orderId - The ID of the order to cancel.
   */
  async cancelOrder(
    accountId: string,
    orderId: string,
  ): Promise<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any | null
    error: Error | null
  }> {
    return this.fetch(`/trading/${accountId}/order/${orderId}`, {
      method: 'DELETE',
    })
  }
}
