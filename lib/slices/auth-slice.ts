import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { authApiSlice } from "../api/auth-api-slice"

interface User {
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const persistedAuth = localStorage.getItem("auth")
    if (persistedAuth) {
      try {
        const { user, token } = JSON.parse(persistedAuth)
        return {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }
      } catch (e) {
        // Invalid stored data
        localStorage.removeItem("auth")
      }
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(authApiSlice.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addMatcher(authApiSlice.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Login failed"
      })
      // Logout
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
