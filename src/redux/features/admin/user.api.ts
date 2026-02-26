import { baseApi } from "../../api/baseApi";

interface IGetAllUsersQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, IGetAllUsersQuery | void>({
      query: (params) => ({
        url: "/user/get-all-users",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["users"],
    }),

    getDeletedUsers: builder.query<any, IGetAllUsersQuery | void>({
      query: (params) => ({
        url: "/user/deleted-users",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["users"],
    }),

    getUnverifiedUsers: builder.query<any, IGetAllUsersQuery | void>({
      query: (params) => ({
        url: "/user/unverified-users",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["users"],
    }),

    blockUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `/user/block-user/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["users"],
    }),

    unblockUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `/user/unblock-user/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["users"],
    }),

    verifyUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `/user/verify-user/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["users"],
    }),

    rejectUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `/user/rejected-users/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetDeletedUsersQuery,
  useGetUnverifiedUsersQuery,

  useBlockUserMutation,
  useUnblockUserMutation,

  useVerifyUserMutation,
  useRejectUserMutation,
} = userApi;
