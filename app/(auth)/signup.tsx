import Auth from "@/src/components/Auth/Auth";
import { router } from "expo-router";
import React from "react";

const SignupScreen = () => {
  return (
    <Auth
      heading="Create Account"
      subHeading="Sign up to get started"
      fields={[
        { name: "name", placeholder: "Enter Your Full Name" },
        {
          name: "email",
          placeholder: "Enter Your Email Address",
          keyboardType: "email-address",
        },
        {
          name: "password",
          placeholder: "Enter Your Password",
          secureTextEntry: true,
        },
        {
          name: "confirmPassword",
          placeholder: "Confirm Your Password",
          secureTextEntry: true,
        },
      ]}
      submitLabel="Sign Up"
      onSubmit={(values) => {
        router.push("/home");
        if (values.password !== values.confirmPassword) {
          console.log("Passwords do not match!");
          return;
        }
        console.log("Signup Submit →", values);
        // API call here
      }}
      onValuesChange={(values) => {
        console.log("Live Values →", values);
      }}
      footerText="Already have an account?"
      footerActionLabel="SignIn"
      onFooterAction={() => router.push("/signin")}
    />
  );
};

export default SignupScreen;
