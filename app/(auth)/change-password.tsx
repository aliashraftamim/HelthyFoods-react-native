import ChangePassword from "@/src/components/Auth/ChangePassword";
import { router } from "expo-router";
import React from "react";

const ChangePasswordScreen = () => {
  return (
    <ChangePassword
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
};

export default ChangePasswordScreen;
