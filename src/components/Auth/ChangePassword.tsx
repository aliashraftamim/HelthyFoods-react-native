import { useChangeMyPasswordMutation } from "@/src/redux/features/auth/authApi";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  onSuccess?: () => void;
  onBack?: () => void;
}

interface FieldError {
  current: string;
  password: string;
  confirm: string;
}

const ChangePassword: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldError>({
    current: "",
    password: "",
    confirm: "",
  });
  const [done, setDone] = useState(false);

  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const newPassRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

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

  const getStrength = (
    val: string,
  ): { level: number; label: string; color: string } => {
    if (val.length === 0) return { level: 0, label: "", color: "#E0E0E0" };
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "#FF3B30" };
    if (score === 2) return { level: 2, label: "Fair", color: "#FF9500" };
    if (score === 3) return { level: 3, label: "Good", color: "#34C759" };
    return { level: 4, label: "Strong", color: "#007AFF" };
  };

  const strength = getStrength(password);

  const validate = (): boolean => {
    const newErrors: FieldError = { current: "", password: "", confirm: "" };
    let valid = true;

    if (!current) {
      newErrors.current = "Current password is required.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "New password is required.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    } else if (password === current) {
      newErrors.password = "New password must be different from current.";
      valid = false;
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm your new password.";
      valid = false;
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = async () => {
    if (!validate()) {
      shake();
      return;
    }

    try {
      const res = await changePassword({
        oldPassword: current,
        newPassword: password,
        confirmPassword: confirm,
      }).unwrap();
      console.log("🚀 ~ handleChange ~ res:", res);

      setDone(true);
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();

      setTimeout(() => onSuccess?.(), 2000);
    } catch (err: any) {
      console.error("❌ Change Password Error →", err);
      Toast.show({
        type: "error",
        text1: err?.data?.message || "Something went wrong!",
      });
      shake();
    }
  };

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  // ── Success Screen ──
  if (done) {
    return (
      <View style={s.successRoot}>
        <Animated.View
          style={[s.successCard, { transform: [{ scale: successScale }] }]}
        >
          <Text style={s.successIcon}>🔐</Text>
          <Text style={s.successHeading}>Password Changed!</Text>
          <Text style={s.successSub}>
            Your password has been updated successfully. You&apos;re all set!
          </Text>
        </Animated.View>
      </View>
    );
  }

  // ── Main Form ──
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ Android fix
    >
      <ScrollView
        contentContainerStyle={s.inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // ✅ Button tap সবসময় কাজ করবে
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={s.iconWrap}>
          <Text style={s.icon}>🔑</Text>
        </View>

        <Text style={s.heading}>Change Password</Text>
        <Text style={s.sub}>
          Enter your current password, then choose a strong new password.
        </Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {/* ── Current Password ── */}
          <Text style={s.label}>Current Password</Text>
          <View style={[s.inputWrap, errors.current ? s.inputError : null]}>
            <Text style={s.inputIcon}>🔒</Text>
            <TextInput
              style={s.input}
              placeholder="Enter current password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showCurrent}
              value={current}
              onChangeText={(t) => {
                setCurrent(t);
                if (errors.current) setErrors((e) => ({ ...e, current: "" }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => newPassRef.current?.focus()}
            />
            <TouchableOpacity
              onPress={() => setShowCurrent((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.eyeIcon}>{showCurrent ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {errors.current !== "" && (
            <Text style={s.errorText}>{errors.current}</Text>
          )}

          {/* ── New Password ── */}
          <Text style={[s.label, { marginTop: 20 }]}>New Password</Text>
          <View style={[s.inputWrap, errors.password ? s.inputError : null]}>
            <Text style={s.inputIcon}>🛡️</Text>
            <TextInput
              ref={newPassRef}
              style={s.input}
              placeholder="Enter new password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: "" }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />
            <TouchableOpacity
              onPress={() => setShowPass((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {errors.password !== "" && (
            <Text style={s.errorText}>{errors.password}</Text>
          )}

          {/* Strength Meter */}
          {password.length > 0 && (
            <View style={s.strengthWrap}>
              <View style={s.strengthBars}>
                {[1, 2, 3, 4].map((lvl) => (
                  <View
                    key={lvl}
                    style={[
                      s.strengthBar,
                      {
                        backgroundColor:
                          lvl <= strength.level ? strength.color : "#E0E0E0",
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[s.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Hints */}
          <View style={s.hintsWrap}>
            {[
              { rule: password.length >= 8, text: "At least 8 characters" },
              { rule: /[A-Z]/.test(password), text: "One uppercase letter" },
              { rule: /[0-9]/.test(password), text: "One number" },
              {
                rule: /[^A-Za-z0-9]/.test(password),
                text: "One special character",
              },
            ].map((h, i) => (
              <Text
                key={i}
                style={[s.hintItem, h.rule ? s.hintPassed : s.hintFailed]}
              >
                {h.rule ? "✓" : "·"} {h.text}
              </Text>
            ))}
          </View>

          {/* ── Confirm Password ── */}
          <Text style={[s.label, { marginTop: 20 }]}>Confirm New Password</Text>
          <View style={[s.inputWrap, errors.confirm ? s.inputError : null]}>
            <Text style={s.inputIcon}>🔒</Text>
            <TextInput
              ref={confirmRef}
              style={s.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                if (errors.confirm) setErrors((e) => ({ ...e, confirm: "" }));
              }}
              returnKeyType="done"
              onSubmitEditing={handleChange}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.eyeIcon}>{showConfirm ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {errors.confirm !== "" && (
            <Text style={s.errorText}>{errors.confirm}</Text>
          )}
        </Animated.View>

        {/* ── Submit Button ── */}
        <TouchableOpacity
          onPress={handleChange}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          disabled={isLoading}
        >
          <Animated.View
            style={[
              s.btn,
              isLoading && s.btnDisabled,
              { transform: [{ scale: btnScale }] },
            ]}
          >
            <Text style={s.btnText}>
              {isLoading ? "Updating..." : "Change Password"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  inner: {
    // ✅ flex: 1 সরানো হয়েছে — ScrollView-এ লাগে না
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 48,
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
  sub: { fontSize: 14, color: "#888", lineHeight: 22, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "600", color: "#444", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 4,
  },
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF5F5" },
  inputIcon: { fontSize: 16, marginRight: 10 },
  eyeIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, color: "#1a1a1a" },
  errorText: { fontSize: 12, color: "#FF3B30", marginBottom: 6, marginLeft: 4 },
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    gap: 10,
  },
  strengthBars: { flexDirection: "row", gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "700",
    width: 48,
    textAlign: "right",
  },
  hintsWrap: { marginTop: 8, gap: 3 },
  hintItem: { fontSize: 12 },
  hintPassed: { color: "#34C759" },
  hintFailed: { color: "#bbb" },
  btn: {
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: { backgroundColor: "#FFB89A", shadowOpacity: 0 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  successRoot: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  successCard: {
    alignItems: "center",
    backgroundColor: "#FFF4EF",
    borderRadius: 24,
    padding: 40,
    width: "100%",
  },
  successIcon: { fontSize: 56, marginBottom: 20 },
  successHeading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  successSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ChangePassword;
