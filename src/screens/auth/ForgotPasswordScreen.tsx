import ForgotPassword from "@/src/components/Auth/ForgotPassword";
import { handleBack } from "@/src/utils/handleBack";
import { router } from "expo-router";
import React from "react";

const ForgotPasswordScreen = () => {
  return (
    <ForgotPassword
      onNext={(email, token) => {
        return router.push({
          pathname: "/otp-verification",
          params: { email, token, mode: "reset" },
        });
      }}
      onBack={() => handleBack("signin")}
    />
  );
};

export default ForgotPasswordScreen;
