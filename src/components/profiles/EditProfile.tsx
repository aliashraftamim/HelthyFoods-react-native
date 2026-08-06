import { useUpdateMeMutation } from "@/src/redux/features/admin/user.api";
import { useGetMeQuery } from "@/src/redux/features/auth/authApi"; // ⚠️ path ঠিক করো
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfile = () => {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery({});
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  console.log(user?.data?.name);

  useEffect(() => {
    if (user) {
      setName(user?.data?.name ?? "");
      setAvatar(user?.data?.profileImage ?? null);
    }
  }, [user]);

  const requestPermission = async (type: "camera" | "gallery") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const pickFromGallery = async () => {
    const granted = await requestPermission("gallery");
    if (!granted) {
      Alert.alert(
        "Permission Denied",
        "Gallery access is required to pick a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      setAvatar(result.assets[0].uri);
      setAvatarChanged(true);
    }
  };

  const pickFromCamera = async () => {
    const granted = await requestPermission("camera");
    if (!granted) {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      setAvatar(result.assets[0].uri);
      setAvatarChanged(true);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Change Profile Photo", "Choose an option", [
      { text: "📷  Take Photo", onPress: pickFromCamera },
      { text: "🖼️  Choose from Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify({ name: name.trim() }));

      if (avatarChanged && avatar) {
        const filename = avatar.split("/").pop() ?? "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("profileImage", {
          uri: avatar,
          name: filename,
          type,
        } as any);
      }

      await updateMe(formData).unwrap();

      Alert.alert("Success ✅", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  if (isUserLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../../../assets/icons/profile.png")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.cameraIconBtn}
              onPress={handleChangePhoto}
              activeOpacity={0.8}
            >
              <Text style={styles.cameraIconText}>📷</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name — editable */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Email — disabled */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedText}>🔒 Not editable</Text>
              </View>
            </View>
            <View style={styles.inputDisabled}>
              <Text style={styles.inputDisabledText}>{user?.email ?? "—"}</Text>
            </View>
          </View>

          {/* Phone — disabled */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedText}>🔒 Not editable</Text>
              </View>
            </View>
            <View style={styles.inputDisabled}>
              <Text style={styles.inputDisabledText}>{user?.phone ?? "—"}</Text>
            </View>
          </View>

          {/* Bio — disabled */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Bio</Text>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedText}>🔒 Not editable</Text>
              </View>
            </View>
            <View style={[styles.inputDisabled, styles.bioInput]}>
              <Text style={styles.inputDisabledText}>{user?.bio ?? "—"}</Text>
            </View>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.button, isUpdating && { opacity: 0.7 }]}
          onPress={handleUpdate}
          activeOpacity={0.85}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 54,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backIcon: {
    fontSize: 18,
    color: "#222",
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.1,
  },

  /* Avatar */
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
    borderRadius: 100,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FF6B35",
  },
  cameraIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIconText: {
    fontSize: 14,
  },
  changePhotoText: {
    color: "#FF6B35",
    fontWeight: "600",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 24,
  },

  /* Form */
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  lockedBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 6,
  },
  lockedText: {
    fontSize: 11,
    color: "#92400e",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 15,
    color: "#1f2937",
  },
  bioInput: {
    minHeight: 90,
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputDisabledText: {
    fontSize: 15,
    color: "#9ca3af",
  },

  /* Button */
  button: {
    backgroundColor: "#FF6B35",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
