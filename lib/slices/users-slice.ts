import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  username: string
  email: string
  deposit: number
  tradeWinEnabled: boolean
  lastLogin: string
  lastLogout: string | null
  createdAt: string
}

interface UsersState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    username: "trader1",
    email: "trader1@example.com",
    deposit: 1000,
    tradeWinEnabled: true,
    lastLogin: "2023-05-15T10:30:00Z",
    lastLogout: "2023-05-15T15:45:00Z",
    createdAt: "2023-01-10T08:00:00Z",
  },
  {
    id: "2",
    username: "trader2",
    email: "trader2@example.com",
    deposit: 2500,
    tradeWinEnabled: false,
    lastLogin: "2023-05-16T09:15:00Z",
    lastLogout: null,
    createdAt: "2023-02-05T14:30:00Z",
  },
  {
    id: "3",
    username: "trader3",
    email: "trader3@example.com",
    deposit: 500,
    tradeWinEnabled: true,
    lastLogin: "2023-05-14T11:20:00Z",
    lastLogout: "2023-05-14T18:10:00Z",
    createdAt: "2023-03-20T10:15:00Z",
  },
]

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // In a real app, this would be an API call
  return mockUsers
})

export const updateUserDeposit = createAsyncThunk(
  "users/updateUserDeposit",
  async ({ userId, amount }: { userId: string; amount: number }) => {
    // In a real app, this would be an API call
    return { userId, amount }
  },
)

export const toggleTradeWin = createAsyncThunk(
  "users/toggleTradeWin",
  async ({ userId, enabled }: { userId: string; enabled: boolean }) => {
    // In a real app, this would be an API call
    return { userId, enabled }
  },
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = state.users.find((user) => user.id === action.payload) || null
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      .addCase(updateUserDeposit.fulfilled, (state, action) => {
        const { userId, amount } = action.payload
        const user = state.users.find((user) => user.id === userId)
        if (user) {
          user.deposit = amount
        }
      })
      .addCase(toggleTradeWin.fulfilled, (state, action) => {
        const { userId, enabled } = action.payload
        const user = state.users.find((user) => user.id === userId)
        if (user) {
          user.tradeWinEnabled = enabled
        }
      })
  },
})

export const { selectUser, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
