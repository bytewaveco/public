import { AccountsApi, type PublicGetAccountHistoryOptions } from './accounts'
import {
  type PublicInstrumentType,
  type PublicGetInstrumentsOptions,
  type PublicInstrument,
  InstrumentsApi,
} from './instruments'
import { MarketDataApi } from './marketData'
import { OptionsApi } from './options'
import {
  type PublicPreflightMultiLegOptions,
  type PublicPreflightSingleLegOptions,
  type PublicPlaceOrderOptions,
  type PublicPlaceOrderMultiLegOptions,
  OrderPlacementApi,
} from './orderPlacement'
export type {
  PublicGetAccountHistoryOptions,
  PublicInstrumentType,
  PublicInstrument,
  PublicGetInstrumentsOptions,
  PublicPlaceOrderOptions,
  PublicPreflightMultiLegOptions,
  PublicPreflightSingleLegOptions,
  PublicPlaceOrderMultiLegOptions,
}

export type PublicGetAccessTokenOptions = {
  validityInMinutes: number
}

export type PublicSession = {
  accessToken: string
  expiresAt: number
  issuedAt: number
}

export type PublicClientFetch = <T = unknown>(
  /* eslint-disable-next-line no-unused-vars */
  url: string,
  /* eslint-disable-next-line no-unused-vars */
  options?: RequestInit,
) => Promise<{
  data: T | null
  error: Error | null
}>

export type PublicClientOptions = object

const PUBLIC_API_URL = 'https://api.public.com' as const
const sessionCache = new Map<string, PublicSession>()

async function getSession(
  secret: string,
  options?: PublicGetAccessTokenOptions,
): Promise<PublicSession | null> {
  const cachedSession = sessionCache.get(secret)
  const validityInMinutes = options?.validityInMinutes ?? 5
  const now = performance.now()

  if (!cachedSession || cachedSession.expiresAt + 5_000 >= now) {
    const response = await fetch(
      `${PUBLIC_API_URL}/userapiauthservice/personal/access-tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validityInMinutes,
          secret,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get session (${response.status})`)
    }

    const data = await response.json()

    sessionCache.set(secret, {
      accessToken: data.accessToken,
      expiresAt: now + validityInMinutes * 60 * 1_000,
      issuedAt: now,
    })
  }

  return sessionCache.get(secret) ?? null
}

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
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars */
  options: PublicClientOptions = {},
) {
  const _fetch: PublicClientFetch = async <T>(
    url: string,
    options?: RequestInit,
  ) => {
    const session = await getSession(secret)
    const result = {
      data: null as T | null,
      error: null as Error | null,
    }

    if (!session) {
      result.error = new Error('Session not found')
      return result
    }

    const response = await fetch(`${PUBLIC_API_URL}/userapigateway${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      result.error = new Error(`Failed to fetch ${url} (${response.status})`)
      return result
    }

    const data = await response.json()

    result.data = data as T

    return result
  }

  return {
    _getSession: getSession,
    accounts: new AccountsApi(_fetch),
    instruments: new InstrumentsApi(_fetch),
    marketData: new MarketDataApi(_fetch),
    orders: new OrderPlacementApi(_fetch),
    options: new OptionsApi(_fetch),
  }
}
