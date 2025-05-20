import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

// Define the base URL for your API
const API_BASE_URL = "https://onchainvip.etoure.com/api/"

// Define a base API slice that other API slices can extend
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = (getState() as RootState).auth.token

      // If we have a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }

      return headers
    },
    // Add credentials for cookies if your API uses them
    credentials: "include",
  }),
  tagTypes: ["Users", "Trades", "Requests"],
  endpoints: () => ({}),
})
