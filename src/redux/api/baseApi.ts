// baseApi.ts
import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import Toast from "react-native-toast-message";
import { logout, setUser } from "../features/auth/authSlice";
import { navigationRef } from "../navigationRef";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.EXPO_PUBLIC_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const skipAuthEndpoints = ["resetForgotPassword", "verifyResetOTP"];

    console.log("🚀 ~ endpoint:", endpoint)
    if (!skipAuthEndpoints.includes(endpoint)) {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", token);
      }
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  // ✅ < যোগ করো
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 404) {
    Toast.show({ type: "error", text1: result.error.data.message });
  }
  if (result?.error?.status === 403) {
    Toast.show({ type: "error", text1: result?.error?.data.message });
  }
  if (result?.error?.status === 401) {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/refresh-token`,
      { method: "POST", credentials: "include" },
    );

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(setUser({ user, token: data?.data?.accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      navigationRef.current?.navigate("Login" as never);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "packages",
    "profileInfo",
    "users",
    "restaurants",
    "events",
    "notifications",
  ],
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
