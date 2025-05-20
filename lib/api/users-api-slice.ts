import { apiSlice } from "./api-slice"

export interface User {
  id: string
  username: string
  email: string
  deposit: number
  tradeWinEnabled: boolean
  lastLogin: string
  lastLogout: string | null
  createdAt: string
}

export interface UserWithBalance {
  id: number;
  email: string;
  trade_win: boolean;
  cash: number;
}

// Extend the base API slice with users endpoints
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserWithBalance[], void>({
      query: () => "/users_with_balance.php",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Users" as const, id })), { type: "Users", id: "LIST" }]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    updateUserDeposit: builder.mutation<User, { userId: string; amount: number }>({
      query: ({ userId, amount }) => ({
        url: `/update_balance.php`,
        method: "PATCH",
        body: { cash: amount, user_id: userId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
    toggleTradeWin: builder.mutation<User, { userId: number; enabled: boolean }>({
      query: ({ userId, enabled }) => ({
        url: `/update_trade_win.php`,
        method: "PATCH",
        body: { trade_win: enabled, user_id:userId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserDepositMutation, useToggleTradeWinMutation } =
  usersApiSlice
