// src/utils/verifyToken.ts
import { jwtDecode } from "jwt-decode";
import { TUser } from "../redux/features/auth/authSlice";

export const verifyToken = (token: string): TUser => {
  return jwtDecode<TUser>(token);
};
