import OTPVerification from "@/src/components/Auth/OTPVerification";
import { handleBack } from "@/src/utils/handleBack";
import { router } from "expo-router";
import React from "react";

const OTPVerificationScreen = () => {
  return (
    <OTPVerification
      email=""
      onNext={(token) => {
        router.push({
          pathname: "/reset-password",
          params: {
            token,
          },
        });
      }}
      onBack={() => handleBack("signin")}
    />
  );
};

export default OTPVerificationScreen;
