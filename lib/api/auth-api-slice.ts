import { setToken } from "../utils/setToken"
import { apiSlice } from "./api-slice"

export interface User {
  uid: string
  email: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login.php",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        // Store in localStorage
        setToken(response)
        return response
      },
      // Handle errors
      transformErrorResponse: (response) => {
        return response.data || { message: "Login failed. Please try again." }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Always remove from localStorage, even if the API call fails
      onQueryStarted: async (_, { queryFulfilled }) => {
        
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApiSlice
