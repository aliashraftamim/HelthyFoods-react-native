import ForgotPassword from "@/src/components/Auth/ForgotPassword";
import { NavigationProp } from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <ForgotPassword
      onNext={(email) =>
        navigation.navigate("OTPVerification", { email, mode: "reset" })
      }
      onBack={() => navigation.goBack()}
    />
  );
};

export default ForgotPasswordScreen;
