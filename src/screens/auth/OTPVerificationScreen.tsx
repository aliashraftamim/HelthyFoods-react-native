import OTPVerification from "@/src/components/Auth/OTPVerification";
import { NavigationProp } from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const OTPVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <OTPVerification
      email=""
      onNext={() => {
        navigation.navigate("ResetPassword");
      }}
      onBack={() => navigation.goBack()}
    />
  );
};

export default OTPVerificationScreen;
