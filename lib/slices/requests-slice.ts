import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Request {
  id: string
  userId: string
  username: string
  amount: number
  type: "deposit" | "withdrawal"
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface RequestsState {
  requests: Request[]
  isLoading: boolean
  error: string | null
}

const initialState: RequestsState = {
  requests: [],
  isLoading: false,
  error: null,
}

// Mock data
const mockRequests: Request[] = [
  {
    id: "1",
    userId: "1",
    username: "trader1",
    amount: 500,
    type: "deposit",
    status: "approved",
    createdAt: "2023-05-14T09:30:00Z",
  },
  {
    id: "2",
    userId: "2",
    username: "trader2",
    amount: 1000,
    type: "deposit",
    status: "pending",
    createdAt: "2023-05-15T14:45:00Z",
  },
  {
    id: "3",
    userId: "3",
    username: "trader3",
    amount: 200,
    type: "withdrawal",
    status: "pending",
    createdAt: "2023-05-16T11:20:00Z",
  },
  {
    id: "4",
    userId: "1",
    username: "trader1",
    amount: 300,
    type: "withdrawal",
    status: "pending",
    createdAt: "2023-05-16T16:10:00Z",
  },
]

export const fetchRequests = createAsyncThunk("requests/fetchRequests", async () => {
  // In a real app, this would be an API call
  return mockRequests
})

export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ requestId, status }: { requestId: string; status: "approved" | "rejected" }) => {
    // In a real app, this would be an API call
    return { requestId, status }
  },
)

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRequests.fulfilled, (state, action: PayloadAction<Request[]>) => {
        state.isLoading = false
        state.requests = action.payload
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch requests"
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const { requestId, status } = action.payload
        const request = state.requests.find((req) => req.id === requestId)
        if (request) {
          request.status = status
        }
      })
  },
})

export default requestsSlice.reducer
