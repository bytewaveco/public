import {
  getAccount,
  getAccountHistory,
  listAccounts,
  type PublicGetAccountHistoryOptions,
} from "./accounts";
import {
  getInstruments,
  type PublicInstrumentType,
  type PublicGetInstrumentsOptions,
  type PublicInstrument,
  getInstrument,
} from "./instruments";
import { getQuotes } from "./marketData";
import {
  getOptionChain,
  getOptionExpirations,
  getOptionGreeks,
} from "./options";
import {
  cancelOrder,
  getOrder,
  placeOrder,
  preflightMultiLeg,
  preflightSingleLeg,
  type PublicPreflightMultiLegOptions,
  type PublicPreflightSingleLegOptions,
  type PublicPlaceOrderOptions,
  type PublicPlaceOrderMultiLegOptions,
  placeOrderMultiLeg,
  createOrderId,
} from "./orderPlacement";
export type {
  PublicGetAccountHistoryOptions,
  PublicInstrumentType,
  PublicInstrument,
  PublicGetInstrumentsOptions,
  PublicPlaceOrderOptions,
  PublicPreflightMultiLegOptions,
  PublicPreflightSingleLegOptions,
  PublicPlaceOrderMultiLegOptions,
};

export type PublicGetAccessTokenOptions = {
  validityInMinutes: number;
};

export type PublicSession = {
  accessToken: string;
  expiresAt: number;
  issuedAt: number;
};

export type PublicClientOptions = {};

export type PublicClientFetch = <T = unknown>(
  url: string,
  options?: RequestInit
) => Promise<{
  data: T | null;
  error: Error | null;
}>;

export type PublicClient = {
  authorization: {
    /**
     * Get an access token from the Public API. This is typically done automatically
     * when using a client.
     *
     * https://public.com/api/docs/resources/authorization/create-personal-access-token
     *
     * @param secret - The secret key for the Public API generated in your account
     * settings.
     * @param options - The options for the access token request.
     *
     * @returns The access token and session information.
     */
    getSession: () => Promise<PublicSession | null>;
  };
  accounts: {
    /**
     * List all accounts for the current user.
     *
     * https://public.com/api/docs/resources/list-accounts/get-accounts
     *
     * @returns The list of accounts.
     */
    listAccounts: () => Promise<{
      data: { accounts: any[] } | null;
      error: Error | null;
    }>;
    /**
     * Get the account details for a given account.
     *
     * https://public.com/api/docs/resources/account-details/get-account-portfolio-v2
     *
     * @param accountId - The ID of the account to get the portfolio for.
     *
     * @returns The account details for the given account.
     */
    getAccount: (accountId: string) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
    /**
     * Get the account history for a given account.
     *
     * https://public.com/api/docs/resources/account-details/get-history
     *
     * @param accountId - The ID of the account to get the history for.
     * @param options - The options to use for the request.
     *
     * @returns The account history for the given account.
     */
    getAccountHistory: (
      accountId: string,
      options?: PublicGetAccountHistoryOptions
    ) => Promise<{
      data: { history: any[] } | null;
      error: Error | null;
    }>;
  };
  instruments: {
    /**
     * Get all instruments.
     *
     * https://public.com/api/docs/resources/instrument-details/get-all-instruments
     *
     * @returns The instruments available on Public.
     */
    getInstruments: () => Promise<{
      data: { instruments: any[] } | null;
      error: Error | null;
    }>;
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
    getInstrument: (
      symbol: string,
      type: PublicInstrumentType
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
  };
  marketData: {
    /**
     * Get the quotes for given instruments.
     *
     * https://public.com/api/docs/resources/market-data/get-quotes
     *
     * @param accountId - The ID of the account to get the quotes for.
     * @param instruments - The instruments to get the quotes for.
     *
     * @returns The quotes for the given instruments.
     */
    getQuotes: (
      accountId: string,
      instruments: PublicInstrument[]
    ) => Promise<{
      data: { quotes: any[] } | null;
      error: Error | null;
    }>;
  };
  orders: {
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
    createOrderId: () => string;
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
    placeOrder: (
      accountId: string,
      options: PublicPlaceOrderOptions
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    placeOrderMultiLeg: (
      accountId: string,
      options: PublicPlaceOrderMultiLegOptions
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    getOrder: (
      accountId: string,
      orderId: string
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
    /**
     * Cancel an order for a given account.
     *
     * https://public.com/api/docs/resources/order-placement/cancel-order
     *
     * @param accountId - The ID of the account to cancel the order for.
     * @param orderId - The ID of the order to cancel.
     */
    cancelOrder: (
      accountId: string,
      orderId: string
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    preflightSingleLeg: (
      accountId: string,
      options: PublicPreflightSingleLegOptions
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    preflightMultiLeg: (
      accountId: string,
      options: PublicPreflightMultiLegOptions
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
  };
  options: {
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
    getOptionGreeks: (
      accountId: string,
      osiOptionSymbol: string
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    getOptionExpirations: (
      accountId: string,
      instrument: PublicInstrument
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
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
    getOptionChain: (
      accountId: string,
      instrument: PublicInstrument,
      expirationDate: string
    ) => Promise<{
      data: any | null;
      error: Error | null;
    }>;
  };
};

const PUBLIC_API_URL = "https://api.public.com/userapiauthservice" as const;

/**
 * Create a new Public client.
 *
 * @param secret - The secret key for the Public API generated in your account
 * settings.
 * @param options - The options for the client.
 *
 * @returns The Public client.
 */
export function createClient(
  secret: string,
  options: PublicClientOptions = {}
): PublicClient {
  let session: PublicSession | null = null;

  async function _setSession(options?: PublicGetAccessTokenOptions) {
    const validityInMinutes = options?.validityInMinutes ?? 5;
    const now = performance.now();

    if (session && session.expiresAt + 5_000 < now) {
      return;
    }

    const response = await fetch(`${PUBLIC_API_URL}/personal/access-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        validityInMinutes,
        secret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get session (${response.status})`);
    }

    const data = await response.json();

    session = {
      accessToken: data.accessToken,
      expiresAt: now + validityInMinutes * 60 * 1_000,
      issuedAt: now,
    };
  }

  async function getSession(
    options?: PublicGetAccessTokenOptions
  ): Promise<PublicSession | null> {
    await _setSession(options);

    return session;
  }

  const _fetch: PublicClientFetch = async <T>(
    url: string,
    options?: RequestInit
  ) => {
    await _setSession();

    const result = {
      data: null as T | null,
      error: null as Error | null,
    };

    if (!session) {
      result.error = new Error("Session not found");
      return result;
    }

    const response = await fetch(`${PUBLIC_API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      result.error = new Error(`Failed to fetch ${url} (${response.status})`);
      return result;
    }

    const data = await response.json();

    result.data = data as T;

    return result;
  };

  return {
    authorization: {
      getSession,
    },
    accounts: {
      listAccounts: () => listAccounts(_fetch),
      getAccount: (accountId: string) => getAccount(_fetch, accountId),
      getAccountHistory: (
        accountId: string,
        options?: PublicGetAccountHistoryOptions
      ) => getAccountHistory(_fetch, accountId, options),
    },
    instruments: {
      getInstruments: () => getInstruments(_fetch),
      getInstrument: (symbol: string, type: PublicInstrumentType) =>
        getInstrument(_fetch, symbol, type),
    },
    marketData: {
      getQuotes: (accountId: string, instruments: PublicInstrument[]) =>
        getQuotes(_fetch, accountId, instruments),
    },
    orders: {
      createOrderId,
      placeOrder: (accountId: string, options: PublicPlaceOrderOptions) =>
        placeOrder(_fetch, accountId, options),
      placeOrderMultiLeg: (
        accountId: string,
        options: PublicPlaceOrderMultiLegOptions
      ) => placeOrderMultiLeg(_fetch, accountId, options),
      getOrder: (accountId: string, orderId: string) =>
        getOrder(_fetch, accountId, orderId),
      cancelOrder: (accountId: string, orderId: string) =>
        cancelOrder(_fetch, accountId, orderId),
      preflightSingleLeg: (
        accountId: string,
        options: PublicPreflightSingleLegOptions
      ) => preflightSingleLeg(_fetch, accountId, options),
      preflightMultiLeg: (
        accountId: string,
        options: PublicPreflightMultiLegOptions
      ) => preflightMultiLeg(_fetch, accountId, options),
    },
    options: {
      getOptionGreeks: (accountId: string, osiOptionSymbol: string) =>
        getOptionGreeks(_fetch, accountId, osiOptionSymbol),
      getOptionExpirations: (accountId: string, instrument: PublicInstrument) =>
        getOptionExpirations(_fetch, accountId, instrument),
      getOptionChain: (
        accountId: string,
        instrument: PublicInstrument,
        expirationDate: string
      ) => getOptionChain(_fetch, accountId, instrument, expirationDate),
    },
  };
}
