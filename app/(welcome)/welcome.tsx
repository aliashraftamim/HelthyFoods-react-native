import { globalStyles } from "@/src/styles/Global";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("../../assets/images/welcome/Media(3).jpg")}
        style={{ width: "100%", height: "50%" }}
        resizeMode="cover"
      />

      {/* Get Started */}
      <TouchableOpacity
        style={[globalStyles.btn, { width: "80%", marginTop: 24 }]}
        onPress={() => router.navigate("/onboarding")}
      >
        <Text style={[globalStyles.btnText, { color: "#fff" }]}>
          Get Started
        </Text>
      </TouchableOpacity>

      {/* Sign In */}
      <TouchableOpacity
        style={[globalStyles.btnOutline, { width: "80%" }]}
        onPress={() => router.navigate("/signin")}
      >
        <Text style={[globalStyles.primaryColor, globalStyles.btnText]}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
