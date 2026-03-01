import { logout } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { handleBack } from "@/src/utils/handleBack";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type MenuItem = {
  icon: string;
  label: string;
  color?: string;
  onPress?: () => void;
};

const MenuGroup = ({ items }: { items: MenuItem[] }) => (
  <View style={styles.menuGroup}>
    {items.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.menuItem,
          index !== items.length - 1 && styles.menuItemBorder,
        ]}
        onPress={item.onPress}
      >
        <MaterialIcons
          name={item.icon}
          size={20}
          color={item.color ?? "#555"}
          style={styles.menuIcon}
        />
        <Text
          style={[styles.menuLabel, item.color ? { color: item.color } : {}]}
        >
          {item.label}
        </Text>
        <MaterialIcons name="chevron-right" size={20} color="#ccc" />
      </TouchableOpacity>
    ))}
  </View>
);

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBack("home")}
        >
          <MaterialIcons name="arrow-back" size={18} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../assets/icons/profile.png")}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>Rhett Raha</Text>
      </View>

      {/* Group 1 — Edit Profile, Favorites */}
      <MenuGroup
        items={[
          {
            icon: "edit",
            label: "Edit Profile",
            onPress: () => router.navigate("/edit-profile"),
          },
          { icon: "favorite-border", label: "Favorites" },
        ]}
      />

      {/* Group 2 — Account */}
      <MenuGroup
        items={[
          {
            icon: "lock-outline",
            label: "Change Password",
            onPress: () => router.navigate("/change-password"),
          },
          { icon: "credit-card", label: "Memberships" },
          { icon: "feedback", label: "Feedback" },
          { icon: "help-outline", label: "FAQ" },
          { icon: "article", label: "Studies" },
        ]}
      />

      {/* Group 3 — Legal + Logout */}
      <MenuGroup
        items={[
          { icon: "notifications-none", label: "Privacy Policy" },
          { icon: "calendar-today", label: "Terms & Condition" },
          { icon: "delete-outline", label: "Delete Account" },
          {
            icon: "logout",
            label: "Log Out",
            color: "#E63946",
            onPress: () => {
              dispatch(logout());
              router.push("/signin");
            },
          },
        ]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#f2f2f2",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#111",
    overflow: "hidden",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  menuGroup: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },
});

export default ProfileScreen;
