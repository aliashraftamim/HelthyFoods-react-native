import { useSendOtpForgotPasswordMutation } from "@/src/redux/features/auth/authApi";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  onNext: (email: string, token: string) => void; // ✅ token যোগ করো
  onBack: () => void;
}

const ForgotPassword: React.FC<Props> = ({ onNext, onBack }) => {
  const [email, setEmail] = useState("backend.aliashraf@gmail.com");
  const [error, setError] = useState("");
  const [sendOtp, { isLoading }] = useSendOtpForgotPasswordMutation();

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isValidEmail = (val: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async () => {
    // ── Validation ──
    if (!email.trim()) {
      setError("Email is required.");
      shake();
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("Enter a valid email address.");
      shake();
      return;
    }

    setError("");

    // ── API Call ──
    try {
      const res = await sendOtp({ email: email.trim() }).unwrap();

      Toast.show({
        type: "success",
        text1: "OTP sent!",
        text2: "Check your email.",
      });
      onNext(email.trim(), res?.data?.resetToken); // ✅ success হলে OTP screen এ যাও
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Otp send failed",
      });
    }
  };

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.inner}>
        <TouchableOpacity
          onPress={onBack}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={s.iconWrap}>
          <Text style={s.icon}>🔐</Text>
        </View>

        <Text style={s.heading}>Forgot Password?</Text>
        <Text style={s.sub}>
          No worries! Enter your email and we&apos;ll send you a verification
          code.
        </Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={[s.inputWrap, error ? s.inputError : null]}>
            <Text style={s.inputIcon}>✉️</Text>
            <TextInput
              style={s.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) setError("");
              }}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
            />
          </View>
          {error !== "" && <Text style={s.errorText}>{error}</Text>}
        </Animated.View>

        <TouchableOpacity
          onPress={handleSubmit}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          disabled={isLoading} // ✅ local loading state এর বদলে RTK এর isLoading
        >
          <Animated.View
            style={[
              s.btn,
              isLoading && s.btnDisabled,
              { transform: [{ scale: btnScale }] },
            ]}
          >
            <Text style={s.btnText}>
              {isLoading ? "Sending Code..." : "Send Reset Code"}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack} style={s.loginRow}>
          <Text style={s.loginText}>
            Remember your password? <Text style={s.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 32,
  },
  backBtn: { marginBottom: 32 },
  backIcon: { fontSize: 24, color: "#1a1a1a" },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#FFF4EF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 34 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  sub: { fontSize: 14, color: "#888", lineHeight: 22, marginBottom: 36 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 6,
  },
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF5F5" },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#1a1a1a" },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginBottom: 16,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: { backgroundColor: "#FFB89A", shadowOpacity: 0 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  loginRow: { marginTop: 28, alignItems: "center" },
  loginText: { fontSize: 14, color: "#888" },
  loginLink: { color: "#FF6B35", fontWeight: "700" },
});

export default ForgotPassword;
