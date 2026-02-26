// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from "@react-navigation/native-stack";
// import React from "react";
// import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
// import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
// import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
// import SigninScreen from "../screens/auth/SignInScreen";
// import SignupScreen from "../screens/auth/SignupScreen";
// import HomeScreen from "../screens/home/HomeScreen";
// import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
// import ProfileScreen from "../screens/profile/ProfileScreen";
// import RestaurantScreen from "../screens/Restaurant/RestaurantScreen";
// import SplashScreen from "../screens/splash/SplashScreen";
// import WelcomeScreen from "../screens/welcome/WelcomeScreen";
// import { RootStackParamList } from "./types";

// const Stack = createNativeStackNavigator();

// const AppNavigator = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Splash"
//       screenOptions={{ headerShown: false }}
//     >
//       <Stack.Screen name="Splash" component={SplashScreen} />

//       <Stack.Screen name="Welcome" component={WelcomeScreen} />
//       <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//       <Stack.Screen name="SignIn" component={SigninScreen} />
//       <Stack.Screen name="Signup" component={SignupScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//       <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
//       <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Restaurant" component={RestaurantScreen} />
//       <Stack.Screen name="Profile" component={ProfileScreen} />
//     </Stack.Navigator>
//   );
// };

// export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export default AppNavigator;
