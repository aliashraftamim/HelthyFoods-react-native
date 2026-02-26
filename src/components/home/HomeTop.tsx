import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { globalStyles } from "../../styles/Global";
import StoryFeature from "./ExpoStory";

// ✅ Custom Close Button
const CustomCloseButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={closeStyles.button}>
    <Text style={closeStyles.text}>✕</Text>
  </TouchableOpacity>
);

const closeStyles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

const HomeTop = ({
  setSearchQuery,
}: {
  setSearchQuery: (text: string) => void;
}) => {
  return (
    <View>
      <View style={styles.topBar}>
        <View style={globalStyles.iconButton}>
          <Image
            source={require("../../assets/screenLogo/screen-logo.png")}
            style={globalStyles.logo}
          />
        </View>
        <TouchableOpacity
          style={styles.profileImage}
          onPress={() => router.push("/profile")}
        >
          <Image
            source={require("../../assets/icons/profile.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#999"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search restaurants or dishes..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <View>
        <StoryFeature></StoryFeature>
      </View>
    </View>
  );
};

// styles একই থাকবে...
const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
});

export default HomeTop;
