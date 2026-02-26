// app/otp-verification.tsx
import OTPVerification from "@/src/components/Auth/OTPVerification";
import { handleBack } from "@/src/utils/handleBack";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

// app/otp-verification.tsx
const OTPVerificationScreen = () => {
  const { email, token } = useLocalSearchParams<{
    email: string;
    token: string;
  }>();

  return (
    <OTPVerification
      email={email ?? ""}
      onNext={(resetToken) => {
        router.push({
          pathname: "/reset-password",
          params: { token: resetToken },
        });
      }}
      onBack={() => handleBack("/forgotPassword")}
    />
  );
};

export default OTPVerificationScreen;
