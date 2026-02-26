import { useVerifyResetOTPMutation } from "@/src/redux/features/auth/authApi";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const OTP_LENGTH = 4; // ✅ 4 করা হয়েছে
const RESEND_COUNTDOWN = 60;

interface Props {
  email: string;
  onNext: (otp: string) => void;
  onBack: () => void;
}

const OTPVerification: React.FC<Props> = ({ email, onNext, onBack }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  const { token } = useLocalSearchParams<{ token: string }>();
  const [verifyOtp, { isLoading }] = useVerifyResetOTPMutation();

  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

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

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (error) setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 4-digit code.");
      shake();
      return;
    }

    setError("");

    // ── API Call ──
    try {
      const res = await verifyOtp({
        otp: code,
        resetToken: token,
      }).unwrap();

      Toast.show({ type: "success", text1: "OTP verified!" });
      onNext(res?.data?.resetToken); // ✅ next screen এ যাও
    } catch (err: any) {
      console.error("❌ OTP Error →", err);
      Toast.show({
        type: "error",
        text1: err?.data?.message || "Invalid OTP!",
      });
      shake();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setCountdown(RESEND_COUNTDOWN);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const maskedEmail = email.replace(
    /^(.{2})(.*)(@.*)$/,
    (_, a, b, c) => a + "*".repeat(b.length) + c,
  );

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
          <Text style={s.icon}>📬</Text>
        </View>

        <Text style={s.heading}>Check your email</Text>
        <Text style={s.sub}>
          We sent a 4-digit code to{"\n"}
          <Text style={s.emailHighlight}>{maskedEmail}</Text>
        </Text>

        <Animated.View
          style={[s.otpRow, { transform: [{ translateX: shakeAnim }] }]}
        >
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => {
                inputRefs.current[idx] = r;
              }}
              style={[
                s.otpBox,
                digit !== "" && s.otpBoxFilled,
                error !== "" && s.otpBoxError,
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, idx)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, idx)
              }
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor="#FF6B35"
              returnKeyType="done"
            />
          ))}
        </Animated.View>

        {error !== "" && <Text style={s.errorText}>{error}</Text>}

        <TouchableOpacity
          onPress={handleVerify}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          disabled={isLoading} // ✅ RTK এর isLoading
        >
          <Animated.View
            style={[
              s.btn,
              isLoading && s.btnDisabled,
              { transform: [{ scale: btnScale }] },
            ]}
          >
            <Text style={s.btnText}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={s.resendRow}>
          <Text style={s.resendLabel}>Didn&apos;t receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[s.resendBtn, !canResend && s.resendDisabled]}>
              {canResend ? "Resend" : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const BOX_SIZE = 56; // ✅ 4 box হওয়ায় একটু বড় করা হয়েছে

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
  emailHighlight: { color: "#FF6B35", fontWeight: "600" },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 16, // ✅ 4 box এ বেশি space
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE + 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    backgroundColor: "#F7F7F7",
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  otpBoxFilled: { borderColor: "#FF6B35", backgroundColor: "#FFF4EF" },
  otpBoxError: { borderColor: "#FF3B30", backgroundColor: "#FFF5F5" },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginBottom: 16,
    marginLeft: 4,
    textAlign: "center",
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
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendLabel: { fontSize: 14, color: "#888" },
  resendBtn: { fontSize: 14, color: "#FF6B35", fontWeight: "700" },
  resendDisabled: { color: "#bbb" },
});

export default OTPVerification;
