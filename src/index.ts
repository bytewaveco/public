import { AccountsApi } from './accounts'
import { InstrumentsApi } from './instruments'
import { MarketDataApi } from './marketData'
import { OptionsApi } from './options'
import { OrderPlacementApi } from './orderPlacement'
export type * from './accounts'
export type * from './instruments'
export type * from './marketData'
export type * from './options'
export type * from './orderPlacement'

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
) => Promise<
  | {
      data: T
      error: null
    }
  | {
      data: null
      error: Error
    }
>

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

    const data = (await response.json()) as {
      message: string
      accessToken: string
    }

    if (!response.ok) {
      throw new Error(data.message)
    }

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
      data: null,
      error: null,
    } as
      | {
          data: T
          error: null
        }
      | {
          data: null
          error: Error
        }

    if (!session) {
      result.error = new Error('Session not found')
      return result
    }

    try {
      const response = await fetch(`${PUBLIC_API_URL}/userapigateway${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        result.data = data as T
      } else {
        result.error = new Error(JSON.stringify(data))
      }
    } catch (error) {
      result.error = error as Error
    }

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
