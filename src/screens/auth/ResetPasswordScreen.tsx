import ResetPassword from "@/src/components/Auth/ResetPassword";
import { NavigationProp } from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const ResetPasswordScreen = () => {
  const navigator = useNavigation<NavigationProp>();

  return (
    <ResetPassword
      onBack={() => navigator.goBack()}
      onSuccess={() => navigator.navigate("SignIn")}
    />
  );
};

export default ResetPasswordScreen;
