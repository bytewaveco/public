import type {
  PublicClientFetch,
  PublicInstrument,
  PublicInstrumentType,
} from '.'
import {
  PublicOpenCloseIndicator,
  PublicOrderSide,
  PublicOrderStatus,
  PublicOrderType,
  PublicTimeInForce,
} from './orderPlacement'

export type PublicAccountType =
  | 'BROKERAGE'
  | 'HIGH_YIELD'
  | 'BOND_ACCOUNT'
  | 'RIA_ASSET'
  | 'TREASURY'
  | 'TRADITIONAL_IRA'
  | 'ROTH_IRA'

export type PublicOptionsLevel =
  | 'NONE'
  | 'LEVEL_1'
  | 'LEVEL_2'
  | 'LEVEL_3'
  | 'LEVEL_4'

export type PublicBrokerageAccountType = 'CASH' | 'MARGIN'

export type PublicTradePermissions =
  | 'BUY_AND_SELL'
  | 'RESTRICTED_SETTLED_FUNDS_ONLY'
  | 'RESTRICTED_CLOSE_ONLY'
  | 'RESTRICTED_NO_TRADING'

export type PublicTransactionType =
  | 'TRADE'
  | 'MONEY_MOVEMENT'
  | 'POSITION_ADJUSTMENT'

export type PublicTransactionSubType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'DEPOSIT_RETURNED'
  | 'WITHDRAWAL_RETURNED'
  | 'DIVIDEND'
  | 'FEE'
  | 'REWARD'
  | 'TREASURY_BILL_TRANSFER'
  | 'INTEREST'
  | 'TRADE'
  | 'TRANSFER'
  | 'MISC'

export type PublicSecurityType =
  | 'EQUITY'
  | 'OPTION'
  | 'CRYPTO'
  | 'ALT'
  | 'TREASURY'
  | 'BOND'

export type PublicTransactionDirection = 'INCOMING' | 'OUTGOING'

/**
 * https://public.com/api/docs/resources/account-details/get-history
 */
export type PublicGetAccountHistoryOptions = {
  /**
   * Start timestamp in ISO 8601 format with timezone. Example:
   * 2025-01-15T09:00:00-05:00 (9 AM EST, New York time). Formatted
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  start?: string
  /**
   * End timestamp in ISO 8601 format with timezone. Example:
   * 2025-04-10T09:00:00-04:00 (9 AM EDT, New York time). Formatted
   * "YYYY-MM-DDTHH:MM:SSZ"
   */
  end?: string
  /**
   * Maximum number of records to return.
   */
  pageSize?: number
  /**
   * Pagination token for fetching the next result set.
   */
  nextToken?: string
}

export class AccountsApi {
  /* eslint-disable-next-line no-unused-vars */
  constructor(private readonly fetch: PublicClientFetch) {}

  /**
   * List all accounts for the current user.
   *
   * https://public.com/api/docs/resources/list-accounts/get-accounts
   *
   * @returns The list of accounts.
   */
  async listAccounts() {
    return this.fetch<{
      accounts: {
        accountId: string
        accountType: PublicAccountType
        optionsLevel: PublicOptionsLevel
        brokerageAccountType: PublicBrokerageAccountType
        tradePermissions: PublicTradePermissions
      }[]
    }>('/trading/account')
  }

  /**
   * Get the account details for a given account.
   *
   * https://public.com/api/docs/resources/account-details/get-account-portfolio-v2
   *
   * @param accountId - The ID of the account to get the portfolio for.
   *
   * @returns The account details for the given account.
   */
  async getAccount(accountId: string) {
    return this.fetch<{
      accountId: string
      accountType: PublicAccountType
      buyingPower: {
        cashOnlyBuyingPower: string
        buyingPower: string
        optionsBuyingPower: string
      }
      equity: {
        type: PublicBrokerageAccountType
        value: string
        percentageOfPortfolio: string
      }[]
      positions: {
        instrument: {
          symbol: string
          name: string
          type: PublicInstrumentType
        }
        quantity: string
        openedAt: string
        currentValue: string
        percentOfPortfolio: string
        lastPrice: {
          lastPrice: string
          timestamp: string
        }
        instrumentGain: {
          gainValue: string
          gainPercentage: string
          timestamp: string
        }
        positionDailyGain: {
          gainValue: string
          gainPercentage: string
          timestamp: string
        }
        costBasis: {
          totalCost: string
          unitCost: string
          gainValue: string
          gainPercentage: string
          lastUpdate: string
        }
      }[]
      orders: {
        orderId: string
        instrument: PublicInstrument
        createdAt: string
        type: PublicOrderType
        side: PublicOrderSide
        status: PublicOrderStatus
        quantity: string
        notionalValue: string
        expiration: {
          timeInForce: PublicTimeInForce
          expirationTime: string
        }
        limitPrice: string
        stopPrice: string
        closedAt: string
        openCloseIndicator: PublicOpenCloseIndicator
        filledQuantity: string
        averagePrice: string
        legs: {
          instrument: PublicInstrument
          side: PublicOrderSide
          openCloseIndicator: PublicOpenCloseIndicator
          ratioQuantity: number
        }[]
      }[]
    }>(`/trading/${accountId}/portfolio/v2`)
  }

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
  getAccountHistory(
    accountId: string,
    options: PublicGetAccountHistoryOptions = {},
  ) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        params.set(key, value.toString())
      }
    }

    const stringParams = params.toString()

    return this.fetch<{
      transactions: {
        timestamp: string
        id: string
        type: PublicTransactionType
        subType: PublicTransactionSubType
        accountNumber: string
        symbol: string
        securityType: PublicSecurityType
        side: PublicOrderSide
        description: string
        netAmount: string
        principalAmount: string
        quantity: string
        direction: PublicTransactionDirection
        fees: string
      }[]
      nextToken: string
      start: string
      end: string
      pageSize: number
    }>(
      `/trading/${accountId}/history${
        stringParams.length > 0 ? `?${stringParams}` : ''
      }`,
    )
  }
}
