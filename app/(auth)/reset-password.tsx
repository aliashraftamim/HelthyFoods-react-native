// app/reset-password.tsx
import ResetPassword from "@/src/components/Auth/ResetPassword";
import { handleBack } from "@/src/utils/handleBack";
import { router } from "expo-router";
import React from "react";

const ResetPasswordScreen = () => {
  return (
    <ResetPassword
      onSuccess={() => router.replace("/signin")}
      onBack={() => handleBack("/otp-verification")}
    />
  );
};

export default ResetPasswordScreen;
