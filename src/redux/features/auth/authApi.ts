import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
    }),

    sendOtpForgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "PATCH",
        body: email,
      }),
    }),

    verifyResetOTP: builder.mutation({
      query: (payload: { otp: string; resetToken: string }) => ({
        url: "/auth/verify-forgot-pass-otp",
        method: "PATCH",
        body: { otp: payload?.otp },
        headers: {
          "Content-Type": "application/json",
          token: payload.resetToken,
        },
      }),
    }),

    resetForgotPassword: builder.mutation({
      query: (payload: {
        newPassword: string;
        confirmPassword: string;
        resetToken: string;
      }) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: {
          newPassword: payload?.newPassword,
          confirmPassword: payload?.confirmPassword,
        },
        headers: {
          "Content-Type": "application/json",
          token: payload.resetToken,
        },
      }),
    }),

    changeMyPassword: builder.mutation({
      query: (payload: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: payload,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["profileInfo"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpForgotPasswordMutation,
  useVerifyResetOTPMutation,
  useResetForgotPasswordMutation,

  useChangeMyPasswordMutation,

  useGetMeQuery,
} = authApi;
