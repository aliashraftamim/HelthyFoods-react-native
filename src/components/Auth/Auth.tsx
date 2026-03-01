// Auth.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Field config type
export type FieldConfig = {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  defaultValue?: string;
};

type AuthProps = {
  heading?: string;
  subHeading?: string;
  fields: FieldConfig[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
  onValuesChange?: (values: Record<string, string>) => void;
  footerText?: string;
  footerActionLabel?: string;
  onFooterAction?: () => void;
  middleContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
};

const Auth = ({
  heading,
  subHeading,
  fields,
  submitLabel,
  onSubmit,
  onValuesChange,
  footerText,
  footerActionLabel,
  onFooterAction,
  middleContent,
  bottomContent,
}: AuthProps) => {
  const initialValues = fields.reduce(
    (acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [focused, setFocused] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    onValuesChange?.(values);
  }, [onValuesChange, values]);

  const handleChange = (name: string, text: string) => {
    setValues((prev) => ({ ...prev, [name]: text }));
  };

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

  const handleSubmit = () => {
    let hasError = false;
    const errors: Record<string, string> = {};
    fields.forEach((f) => {
      if (!values[f.name]?.trim()) {
        errors[f.name] = `${f.placeholder} is required`;
        hasError = true;
      }
    });

    if (hasError) {
      setFieldError(errors);
      shake();
      return;
    }

    setFieldError({});
    onSubmit(values);
  };

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const toggleShowPassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo + Heading */}
      <View style={styles.headerWrap}>
        <Image
          source={require("../../../assets/images/screenLogo/screen-logo.png")}
          style={styles.logo}
        />
        {heading && <Text style={styles.heading}>{heading}</Text>}
        {subHeading && <Text style={styles.subHeading}>{subHeading}</Text>}
      </View>

      {/* Input Fields */}
      <View style={{ marginTop: 20 }}>
        {fields.map((field) => (
          <Animated.View
            key={field.name}
            style={{
              transform: [
                { translateX: fieldError[field.name] ? shakeAnim : 0 },
              ],
              marginBottom: 12,
            }}
          >
            <View
              style={[
                styles.inputWrap,
                focused === field.name && styles.inputActive,
                !!fieldError[field.name] && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                secureTextEntry={
                  field.secureTextEntry ? !showPassword[field.name] : false
                }
                keyboardType={field.keyboardType ?? "default"}
                autoCapitalize="none"
                autoCorrect={false}
                value={values[field.name]}
                onChangeText={(t) => {
                  handleChange(field.name, t);
                  setFieldError((prev) => ({ ...prev, [field.name]: "" }));
                }}
                onFocus={() => setFocused(field.name)}
                onBlur={() => setFocused(null)}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
              />

              {/* Eye icon — শুধু password field এ দেখাবে */}
              {field.secureTextEntry && (
                <TouchableOpacity
                  onPress={() => toggleShowPassword(field.name)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword[field.name] ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {fieldError[field.name] && (
              <Text style={styles.errorText}>{fieldError[field.name]}</Text>
            )}
          </Animated.View>
        ))}
      </View>

      {/* Middle Content */}
      {middleContent && <View>{middleContent}</View>}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{ marginTop: 12 }}
      >
        <Animated.View
          style={[styles.button, { transform: [{ scale: btnScale }] }]}
        >
          <Text style={styles.buttonText}>{submitLabel}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Bottom Content */}
      {bottomContent && <View>{bottomContent}</View>}

      {/* Footer */}
      {footerText && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText} </Text>
          {footerActionLabel && (
            <TouchableOpacity onPress={onFooterAction}>
              <Text style={styles.footerAction}>{footerActionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 32,
  },
  headerWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logo: { width: 72, height: 72, marginBottom: 24 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
  },
  inputActive: { borderColor: "#FF6B35" },
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF5F5" },
  eyeIcon: { fontSize: 16, marginLeft: 8 },
  errorText: { color: "#FF3B30", marginTop: 4, marginLeft: 4, fontSize: 12 },
  button: {
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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerText: { fontSize: 14, color: "#888" },
  footerAction: { color: "#FF6B35", fontWeight: "700", fontSize: 14 },
});
