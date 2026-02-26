import { useLoginMutation } from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { globalStyles } from "@/src/styles/Global";
import { verifyToken } from "@/src/utils/verifyToken";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { formStyles } from "../../styles/FormStyles";
import Auth from "../shared/Auth/Auth";

const SigninScreen = () => {
  const [remember, setRemember] = useState(false);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: Record<string, string>) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      const user = verifyToken(res.data.accessToken);
      dispatch(setUser({ user, token: res.data.accessToken }));

      Toast.show({ type: "success", text1: "Login successful!" });
      router.push("/home");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.data?.message || "Login failed!",
      });
    }
  };

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
        onPress={() => router.push("/forgot-password")}
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
          defaultValue: "backend.aliashraf@gmail.com",
        },
        {
          name: "password",
          placeholder: "Enter Your Password",
          secureTextEntry: true,
          defaultValue: "12345Abcc!",
        },
      ]}
      submitLabel={isLoading ? "Loading..." : "Submit"}
      onSubmit={handleLogin}
      middleContent={rememberAndForgot}
      bottomContent={socialLogin}
      footerText="Don't have an account?"
      footerActionLabel="Sign Up"
      onFooterAction={() => router.push("/signup")}
    />
  );
};

export default SigninScreen;
