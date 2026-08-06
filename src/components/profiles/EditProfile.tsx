import { useUpdateMeMutation } from "@/src/redux/features/admin/user.api";
import { useGetMeQuery } from "@/src/redux/features/auth/authApi"; // ⚠️ path ঠিক করো
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
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
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  // Simple inline error/success banner instead of native Alert for validation
  const [banner, setBanner] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user?.data?.name ?? "");
      setAvatar(user?.data?.profileImage ?? null);
    }
  }, [user]);

  useEffect(() => {
    if (banner) {
      const t = setTimeout(() => setBanner(null), 3000);
      return () => clearTimeout(t);
    }
  }, [banner]);

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
    setPhotoModalVisible(false);
    const granted = await requestPermission("gallery");
    if (!granted) {
      setBanner({
        type: "error",
        message: "Gallery access is required to pick a photo.",
      });
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
    setPhotoModalVisible(false);
    const granted = await requestPermission("camera");
    if (!granted) {
      setBanner({
        type: "error",
        message: "Camera access is required to take a photo.",
      });
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

  const handleUpdate = async () => {
    if (!name.trim()) {
      setBanner({ type: "error", message: "Name cannot be empty." });
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

      setBanner({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => router.back(), 900);
    } catch (error: any) {
      setBanner({
        type: "error",
        message:
          error?.data?.message ?? "Something went wrong. Please try again.",
      });
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

      {/* Inline banner (replaces Alert.alert for feedback) */}
      {banner && (
        <View
          style={[
            styles.banner,
            banner.type === "error" ? styles.bannerError : styles.bannerSuccess,
          ]}
        >
          <Text style={styles.bannerIcon}>
            {banner.type === "error" ? "⚠️" : "✅"}
          </Text>
          <Text
            style={[
              styles.bannerText,
              banner.type === "error"
                ? styles.bannerTextError
                : styles.bannerTextSuccess,
            ]}
          >
            {banner.message}
          </Text>
        </View>
      )}

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
              onPress={() => setPhotoModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.cameraIconText}>📷</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setPhotoModalVisible(true)}
            activeOpacity={0.7}
          >
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

      {/* Custom bottom-sheet modal replacing Alert.alert */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPhotoModalVisible(false)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Change Profile Photo</Text>
            <Text style={styles.sheetSubtitle}>
              Choose how you&apos;d like to update your picture
            </Text>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={pickFromCamera}
              activeOpacity={0.7}
            >
              <View style={styles.sheetIconWrap}>
                <Text style={styles.sheetIconText}>📷</Text>
              </View>
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>Take Photo</Text>
                <Text style={styles.sheetOptionDesc}>Use your camera</Text>
              </View>
              <Text style={styles.sheetChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOption}
              onPress={pickFromGallery}
              activeOpacity={0.7}
            >
              <View style={styles.sheetIconWrap}>
                <Text style={styles.sheetIconText}>🖼️</Text>
              </View>
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.sheetOptionDesc}>
                  Pick an existing photo
                </Text>
              </View>
              <Text style={styles.sheetChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setPhotoModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
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

  /* Banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  bannerError: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  bannerSuccess: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  bannerIcon: {
    fontSize: 14,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
  bannerTextError: {
    color: "#b91c1c",
  },
  bannerTextSuccess: {
    color: "#15803d",
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
    marginBottom: 12,
    borderRadius: 100,
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: "#FF6B35",
  },
  cameraIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#fff",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
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
    padding: 13,
    borderRadius: 12,
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
    padding: 13,
    borderRadius: 12,
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
    padding: 16,
    borderRadius: 16,
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

  /* Custom bottom-sheet modal (replaces the ugly native Alert popup) */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  sheetIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sheetIconText: {
    fontSize: 18,
  },
  sheetOptionTextWrap: {
    flex: 1,
  },
  sheetOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  sheetOptionDesc: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
  },
  sheetChevron: {
    fontSize: 22,
    color: "#d1d5db",
  },
  cancelBtn: {
    marginTop: 6,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
});
