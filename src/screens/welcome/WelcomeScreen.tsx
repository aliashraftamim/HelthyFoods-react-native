import { globalStyles } from "@/src/styles/Global";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

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
        onPress={() => navigation.navigate("Onboarding")}
      >
        <Text style={[globalStyles.btnText, { color: "#fff" }]}>Get Started</Text>
      </TouchableOpacity>

      {/* Sign In */}
      <TouchableOpacity
        style={[globalStyles.btnOutline, { width: "80%",  }]}
        onPress={() => navigation.navigate("SignIn")} // 👈 add করো
      >
        <Text style={[globalStyles.primaryColor, globalStyles.btnText]}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
