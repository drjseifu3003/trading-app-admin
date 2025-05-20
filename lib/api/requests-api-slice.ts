import { apiSlice } from "./api-slice"

export interface Request {
  id: string
  userId: string
  username: string
  amount: number
  type: "deposit" | "withdrawal"
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Extend the base API slice with requests endpoints
export const requestsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<Request[], void>({
      query: () => "/requests",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Requests" as const, id })), { type: "Requests", id: "LIST" }]
          : [{ type: "Requests", id: "LIST" }],
    }),
    updateRequestStatus: builder.mutation<Request, { requestId: string; status: "approved" | "rejected" }>({
      query: ({ requestId, status }) => ({
        url: `/requests/${requestId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "Requests", id: requestId },
        { type: "Requests", id: "LIST" },
      ],
    }),
  }),
})

export const { useGetRequestsQuery, useUpdateRequestStatusMutation } = requestsApiSlice
