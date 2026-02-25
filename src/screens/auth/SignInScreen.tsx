import { NavigationProp } from "@/src/navigation/AppNavigator";
import { globalStyles } from "@/src/styles/Global";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { formStyles } from "../../styles/FormStyles";
import Auth from "../shared/Auth/Auth";

const SigninScreen = () => {
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const rememberAndForgot = (
    <View style={formStyles.bottomContainer}>
      <View style={formStyles.rememberContainer}>
        <TouchableOpacity
          style={[formStyles.checkbox, remember && formStyles.checkboxChecked]}
          onPress={() => setRemember(!remember)}
        >
          {remember && <Text style={formStyles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={formStyles.rememberText}>Keep me signed in</Text>
      </View>

      <Text
        style={globalStyles.loginLink}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        Forgot Password
      </Text>
    </View>
  );

  const socialLogin = (
    <>
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Text>---------------- or Continue with ----------------</Text>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <TouchableOpacity
          style={formStyles.socialLoginButton}
          onPress={() => console.log("Google pressed")}
        >
          <View style={formStyles.socialContent}>
            <Image
              style={formStyles.socialButtonIcon}
              source={require("../../assets/icons/google.png")}
            />
            <Text style={formStyles.socialLoginButtonText}>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={formStyles.socialLoginButton}
          onPress={() => console.log("Apple pressed")}
        >
          <View style={formStyles.socialContent}>
            <Image
              style={formStyles.socialButtonIcon}
              source={require("../../assets/icons/apple-logo.png")}
            />
            <Text style={formStyles.socialLoginButtonText}>
              Continue with Apple
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Auth
      subHeading="Login to your account"
      fields={[
        {
          name: "email",
          placeholder: "Enter Your Email Address",
          keyboardType: "email-address",
          defaultValue: "abc@gmail.com",
        },
        {
          name: "password",
          placeholder: "Enter Your Password",
          secureTextEntry: true,
          defaultValue: "password123",
        },
      ]}
      submitLabel="Submit"
      onSubmit={(values) => {
        console.log("Login Submit →", values);
        navigation.navigate("Home");
      }}
      onValuesChange={(values) => {
        console.log("Live Values →", values);
      }}
      middleContent={rememberAndForgot}
      bottomContent={socialLogin}
      footerText="Don't have an account?"
      footerActionLabel="Sign Up"
      onFooterAction={() => navigation.navigate("Signup")}
    />
  );
};

export default SigninScreen;
