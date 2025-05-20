import { apiSlice } from "./api-slice"

export interface Trade {
  id: string
  userId: string
  username: string
  tradeTime: string
  tradeDate: string
  expectedWinLoss: number
  finalWinLoss: number
  status: "pending" | "completed" | "cancelled"
}

export interface TradeWithUser {
  id: number;
  user_id: number;
  date: string; // ISO format date string, e.g., "2025-05-20"
  time: string; // e.g., "14:33:21"
  expected_profit_loss: number;
  final_profit_loss: number;
  symbol: string;
  currency_pair: string;
  win: boolean;
  email: string;
  type: string
}


// Extend the base API slice with trades endpoints
export const tradesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrades: builder.query<TradeWithUser[], void>({
      query: () => "/trade_with_user.php",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Trades" as const, id })), { type: "Trades", id: "LIST" }]
          : [{ type: "Trades", id: "LIST" }],
    }),
    getUserTrades: builder.query<Trade[], string>({
      query: (userId) => `/users/${userId}/trades`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Trades" as const, id })), { type: "Trades", id: "LIST" }]
          : [{ type: "Trades", id: "LIST" }],
    }),
    updateTradeStatus: builder.mutation<Trade, { tradeId: string; status: "pending" | "completed" | "cancelled" }>({
      query: ({ tradeId, status }) => ({
        url: `/trades/${tradeId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { tradeId }) => [
        { type: "Trades", id: tradeId },
        { type: "Trades", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetTradesQuery, useGetUserTradesQuery, useUpdateTradeStatusMutation } = tradesApiSlice
