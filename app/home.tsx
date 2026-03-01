import HomeBody from "@/src/components/home/HomeBody";
import HomeTop from "@/src/components/home/HomeTop";
import { useState } from "react";
import { View } from "react-native";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: "#fff",
      }}
    >
      <HomeTop setSearchQuery={setSearchQuery} />
      <HomeBody searchQuery={searchQuery} />
    </View>
  );
};

export default HomeScreen;
