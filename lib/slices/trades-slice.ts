import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Trade {
  id: string
  userId: string
  username: string
  tradeTime: string
  tradeDate: string
  expectedWinLoss: number
  finalWinLoss: number
  status: "pending" | "completed" | "cancelled"
}

interface TradesState {
  trades: Trade[]
  isLoading: boolean
  error: string | null
}

const initialState: TradesState = {
  trades: [],
  isLoading: false,
  error: null,
}

// Mock data
const mockTrades: Trade[] = [
  {
    id: "1",
    userId: "1",
    username: "trader1",
    tradeTime: "10:30:00",
    tradeDate: "2023-05-15",
    expectedWinLoss: 150,
    finalWinLoss: 120,
    status: "completed",
  },
  {
    id: "2",
    userId: "2",
    username: "trader2",
    tradeTime: "11:45:00",
    tradeDate: "2023-05-15",
    expectedWinLoss: -75,
    finalWinLoss: -100,
    status: "completed",
  },
  {
    id: "3",
    userId: "1",
    username: "trader1",
    tradeTime: "14:20:00",
    tradeDate: "2023-05-16",
    expectedWinLoss: 200,
    finalWinLoss: 180,
    status: "completed",
  },
  {
    id: "4",
    userId: "3",
    username: "trader3",
    tradeTime: "09:15:00",
    tradeDate: "2023-05-17",
    expectedWinLoss: 50,
    finalWinLoss: 0,
    status: "pending",
  },
]

export const fetchTrades = createAsyncThunk("trades/fetchTrades", async () => {
  // In a real app, this would be an API call
  return mockTrades
})

export const fetchUserTrades = createAsyncThunk("trades/fetchUserTrades", async (userId: string) => {
  // In a real app, this would be an API call
  return mockTrades.filter((trade) => trade.userId === userId)
})

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTrades.fulfilled, (state, action: PayloadAction<Trade[]>) => {
        state.isLoading = false
        state.trades = action.payload
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch trades"
      })
      .addCase(fetchUserTrades.fulfilled, (state, action: PayloadAction<Trade[]>) => {
        state.isLoading = false
        // In this case, we're just replacing the trades array with user-specific trades
        // In a real app, you might want to store these separately
        state.trades = action.payload
      })
  },
})

export default tradesSlice.reducer
