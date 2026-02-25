export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  OTPVerification: { email: string; mode: "reset" | "signup" };
  Home: undefined;
  Restaurant: { id: string };
  Profile: undefined;
};
