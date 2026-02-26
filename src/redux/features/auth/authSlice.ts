// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null, // ✅ redux-persist নিজেই AsyncStorage থেকে restore করবে
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      // ✅ RN এ role check এখানে না করে component এ করো
      state.user = user;
      state.token = token;
      // ❌ Cookies.set() — দরকার নেই, persist করবে
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // ❌ Cookies.remove() — দরকার নেই
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
