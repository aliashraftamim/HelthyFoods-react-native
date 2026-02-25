// ─────────────────────────────────────────────────────────────
// StoryFeature.tsx
// Food App Story Feature — Image | Video | Text | Color
// React Native — Zero type errors — No extra packages needed
// Requires: npx expo install expo-image-picker
// ─────────────────────────────────────────────────────────────

import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  ColorStory,
  ImageStory,
  storyData as initialStoryData,
  Story,
  StoryUser,
  TextStory,
  VideoStory,
} from "./helper.home";

const { width: SW } = Dimensions.get("window");
const STORY_DURATION = 5000;
const MY_USER_ID = 0;
const MY_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";

// ─────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────
function isImageStory(s: Story): s is ImageStory {
  return s?.type === "image";
}
function isVideoStory(s: Story): s is VideoStory {
  return s?.type === "video";
}
function isTextStory(s: Story): s is TextStory {
  return s?.type === "text";
}
function isColorStory(s: Story): s is ColorStory {
  return s?.type === "color";
}

// ─────────────────────────────────────────
// Gradient Box
// ─────────────────────────────────────────
interface GradientBoxProps {
  colors: [string, string];
  style?: object;
  children?: React.ReactNode;
}
const GradientBox: React.FC<GradientBoxProps> = ({
  colors,
  style,
  children,
}) => <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>;

// ─────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────
interface ProgressBarProps {
  duration: number;
  active: boolean;
  completed: boolean;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  active,
  completed,
}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    progress.setValue(completed ? 1 : 0);
    if (active) {
      animRef.current = Animated.timing(progress, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      });
      animRef.current.start();
    }
    return () => {
      animRef.current?.stop();
    };
  }, [active, completed, duration]);

  return (
    <View style={pStyles.track}>
      <Animated.View
        style={[
          pStyles.fill,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

const pStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 2.5,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 2,
    marginHorizontal: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
});

// ─────────────────────────────────────────
// Story Content Renderer
// ─────────────────────────────────────────
interface StoryContentProps {
  story: Story;
  paused: boolean;
}
const StoryContent: React.FC<StoryContentProps> = ({
  story,
  paused: _paused,
}) => {
  if (isImageStory(story)) {
    return (
      <Image
        source={{ uri: story.story_image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
    );
  }

  if (isVideoStory(story)) {
    // Uncomment if expo-av is installed:
    // import { Video, ResizeMode } from "expo-av";
    // return (
    //   <Video
    //     source={{ uri: story.story_video }}
    //     style={StyleSheet.absoluteFillObject}
    //     resizeMode={ResizeMode.COVER}
    //     shouldPlay={!_paused}
    //     isLooping={false}
    //   />
    // );
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {story.thumbnail != null && (
          <Image
            source={{ uri: story.thumbnail }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
        <View style={cStyles.videoOverlay}>
          <View style={cStyles.playCircle}>
            <Text style={cStyles.playIcon}>▶</Text>
          </View>
          <Text style={cStyles.videoLabel}>Video Story</Text>
          <Text style={cStyles.videoHint}>
            Install expo-av to enable video playback
          </Text>
        </View>
      </View>
    );
  }

  if (isTextStory(story) || isColorStory(story)) {
    return (
      <GradientBox
        colors={story.backgroundColor}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={cStyles.textCenter}>
          {story.emoji != null && (
            <Text style={cStyles.bigEmoji}>{story.emoji}</Text>
          )}
          <Text style={[cStyles.storyText, { color: story.textColor }]}>
            {story.text}
          </Text>
        </View>
      </GradientBox>
    );
  }

  return null;
};

const cStyles = StyleSheet.create({
  videoOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  playIcon: { color: "#fff", fontSize: 28, marginLeft: 4 },
  videoLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  videoHint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  textCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  bigEmoji: { fontSize: 64, marginBottom: 20 },
  storyText: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

// ─────────────────────────────────────────
// Story Viewer (Full Screen)
// ─────────────────────────────────────────
interface StoryViewerProps {
  userStory: StoryUser;
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  userStory,
  onClose,
  onNextUser,
  onPrevUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentStory = userStory.stories[currentIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    clearTimer();
    if (currentIndex < userStory.stories.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentIndex((prev) => prev + 1);
    } else {
      onNextUser();
    }
  }, [
    currentIndex,
    userStory.stories.length,
    clearTimer,
    fadeAnim,
    onNextUser,
  ]);

  const goPrev = useCallback(() => {
    clearTimer();
    if (currentIndex > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentIndex((prev) => prev - 1);
    } else {
      onPrevUser();
    }
  }, [currentIndex, clearTimer, fadeAnim, onPrevUser]);

  useEffect(() => {
    if (paused) return;
    clearTimer();
    timerRef.current = setTimeout(goNext, STORY_DURATION);
    return clearTimer;
  }, [currentIndex, paused, goNext, clearTimer]);

  const handleTap = (e: { nativeEvent: { locationX: number } }) => {
    if (e.nativeEvent.locationX < SW / 3) goPrev();
    else goNext();
  };

  const handlePressIn = () => {
    longPressRef.current = setTimeout(() => setPaused(true), 120);
  };

  const handlePressOut = () => {
    if (longPressRef.current != null) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
    setPaused(false);
  };

  const storyTypeBadge = (): string => {
    switch (currentStory?.type) {
      case "image":
        return "📷";
      case "video":
        return "🎬";
      case "text":
        return "✍️";
      case "color":
        return "🎨";
      default:
        return "";
    }
  };

  return (
    <View style={vStyles.container}>
      <StatusBar hidden />

      <Animated.View
        style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
      >
        <StoryContent story={currentStory} paused={paused} />
        <View style={vStyles.topGradient} pointerEvents="none" />
        <View style={vStyles.bottomGradient} pointerEvents="none" />
      </Animated.View>

      <TouchableWithoutFeedback
        onPress={handleTap}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>

      {!paused && (
        <SafeAreaView
          style={[
            vStyles.header,
            { paddingTop: Platform.OS === "android" ? 32 : 8 },
          ]}
          pointerEvents="box-none"
        >
          <View style={vStyles.progressRow}>
            {userStory.stories.map((_: Story, idx: number) => (
              <ProgressBar
                key={idx}
                duration={STORY_DURATION}
                active={idx === currentIndex}
                completed={idx < currentIndex}
              />
            ))}
          </View>
          <View style={vStyles.userRow}>
            <Image
              source={{ uri: userStory.user_image }}
              style={vStyles.avatar}
            />
            <View style={vStyles.userInfo}>
              <Text style={vStyles.userName}>{userStory.user_name}</Text>
              <Text style={vStyles.timeText}>Just now</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={vStyles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={vStyles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {!paused && (
        <View style={vStyles.swipeRow} pointerEvents="none">
          <View style={vStyles.swipePill}>
            <Text style={vStyles.swipeArrow}>↑</Text>
            <Text style={vStyles.swipeText}>{currentStory?.swipeText}</Text>
          </View>
        </View>
      )}

      {paused && (
        <View style={vStyles.pauseOverlay} pointerEvents="none">
          <Text style={vStyles.pauseIcon}>⏸</Text>
        </View>
      )}

      {!paused && (
        <View style={vStyles.typeBadge} pointerEvents="none">
          <Text style={vStyles.typeBadgeText}>{storyTypeBadge()}</Text>
        </View>
      )}
    </View>
  );
};

const vStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  progressRow: { flexDirection: "row", marginBottom: 10 },
  userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: { flex: 1, marginLeft: 10 },
  userName: { color: "#fff", fontWeight: "700", fontSize: 15 },
  timeText: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 1 },
  closeBtn: { padding: 6 },
  closeIcon: { color: "#fff", fontSize: 20 },
  swipeRow: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 30 : 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  swipePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  swipeArrow: { color: "#fff", fontSize: 16, fontWeight: "700" },
  swipeText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseIcon: { fontSize: 64, opacity: 0.7 },
  typeBadge: {
    position: "absolute",
    top: Platform.OS === "android" ? 100 : 120,
    right: 16,
  },
  typeBadgeText: { fontSize: 22 },
});

// ─────────────────────────────────────────
// Add Story Card  (always first in list)
// ─────────────────────────────────────────
interface AddStoryCardProps {
  myStories: Story[];
  onAddPress: () => void;
  onViewPress: () => void;
}

const AddStoryCard: React.FC<AddStoryCardProps> = ({
  myStories,
  onAddPress,
  onViewPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const hasStories = myStories.length > 0;

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const lastStory = myStories[myStories.length - 1];
  const thumbUri: string =
    hasStories && lastStory != null && isImageStory(lastStory)
      ? lastStory.story_image
      : hasStories &&
          lastStory != null &&
          isVideoStory(lastStory) &&
          lastStory.thumbnail != null
        ? lastStory.thumbnail
        : MY_PROFILE_IMAGE;

  return (
    <TouchableOpacity
      onPress={hasStories ? onViewPress : onAddPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[addStyles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Circular ring */}
        <View
          style={[
            addStyles.ring,
            hasStories ? addStyles.ringActive : addStyles.ringEmpty,
          ]}
        >
          <Image
            source={{ uri: thumbUri }}
            style={addStyles.thumb}
            resizeMode="cover"
          />
        </View>

        {/* Plus button — always visible so user can add more */}
        <TouchableOpacity
          onPress={onAddPress}
          style={addStyles.plusBtn}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Text style={addStyles.plusIcon}>+</Text>
        </TouchableOpacity>

        <Text style={addStyles.label}>Your Story</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const addStyles = StyleSheet.create({
  card: {
    width: 72,
    marginRight: 14,
    alignItems: "center",
  },
  ring: {
    width: 68,
    height: 68,
    borderRadius: 34, // ← fully circular
    padding: 2.5,
    overflow: "hidden",
  },
  ringActive: {
    borderWidth: 2.5,
    borderColor: "#FF6B35",
  },
  ringEmpty: {
    borderWidth: 2,
    borderColor: "#d0d0d0",
    borderStyle: "dashed",
  },
  thumb: {
    flex: 1,
    borderRadius: 32, // ← fully circular
    backgroundColor: "#f0f0f0",
  },
  plusBtn: {
    position: "absolute",
    bottom: 22,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF6B35",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 17,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 6,
    textAlign: "center",
  },
});

// ─────────────────────────────────────────
// Story Thumbnail Card  (fully rounded)
// ─────────────────────────────────────────
interface StoryCardProps {
  item: StoryUser;
  seen: boolean;
  onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ item, seen, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const firstStory = item.stories[0];
  const thumbUri: string = isImageStory(firstStory)
    ? firstStory.story_image
    : isVideoStory(firstStory) && firstStory.thumbnail != null
      ? firstStory.thumbnail
      : item.user_image;

  const hasVideo = item.stories.some(isVideoStory);
  const hasTextOrColor = item.stories.some(
    (s) => isTextStory(s) || isColorStory(s),
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[scStyles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Fully circular ring + thumb */}
        <View
          style={[
            scStyles.ring,
            seen ? scStyles.ringGrey : scStyles.ringActive,
          ]}
        >
          <Image
            source={{ uri: thumbUri }}
            style={scStyles.thumb}
            resizeMode="cover"
          />

          {/* Video / text badges at bottom-right of circle */}
          {(hasVideo || hasTextOrColor) && (
            <View style={scStyles.badgeRow}>
              {hasVideo && <Text style={scStyles.badge}>🎬</Text>}
              {hasTextOrColor && <Text style={scStyles.badge}>✍️</Text>}
            </View>
          )}
        </View>

        {/* Small restaurant avatar overlapping bottom of circle */}
        <Image source={{ uri: item.user_image }} style={scStyles.avatar} />

        <Text style={scStyles.name} numberOfLines={1}>
          {item.user_name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const scStyles = StyleSheet.create({
  card: {
    width: 72,
    marginRight: 14,
    alignItems: "center",
  },
  ring: {
    width: 68,
    height: 68,
    borderRadius: 34, // ← fully circular
    padding: 2.5,
    overflow: "hidden",
  },
  ringActive: {
    borderWidth: 2.5,
    borderColor: "#FF6B35",
  },
  ringGrey: {
    borderWidth: 2.5,
    borderColor: "#ccc",
  },
  thumb: {
    flex: 1,
    borderRadius: 32, // ← fully circular
    backgroundColor: "#eee",
  },
  badgeRow: {
    position: "absolute",
    bottom: 3,
    right: 2,
    flexDirection: "row",
    gap: 1,
  },
  badge: { fontSize: 10 },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11, // ← circular
    borderWidth: 2,
    borderColor: "#fff",
    marginTop: -11,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 6,
    textAlign: "center",
    width: 72,
  },
});

// ─────────────────────────────────────────
// Permission helpers
// ─────────────────────────────────────────
async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
}

async function requestGalleryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
}

// ─────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────
const StoryFeature: React.FC = () => {
  const [storyList] = useState<StoryUser[]>(initialStoryData);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set());
  const [activeUserIndex, setActiveUserIndex] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [myStoryOpen, setMyStoryOpen] = useState(false);

  // ── Converts a picked asset into a Story object ───────────
  const buildStory = useCallback(
    (asset: ImagePicker.ImagePickerAsset): Story => {
      if (asset.type === "video") {
        const s: VideoStory = {
          story_id: Date.now(),
          type: "video",
          story_video: asset.uri,
          thumbnail: asset.uri,
          swipeText: "My Video Story",
          onPress: () => {},
        };
        return s;
      }
      const s: ImageStory = {
        story_id: Date.now(),
        type: "image",
        story_image: asset.uri,
        swipeText: "My Story",
        onPress: () => {},
      };
      return s;
    },
    [],
  );

  // ── Camera ────────────────────────────────────────────────
  const handleCamera = useCallback(async () => {
    const ok = await requestCameraPermission();
    if (!ok) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMyStories((prev) => [...prev, buildStory(result.assets[0])]);
    }
  }, [buildStory]);

  // ── Gallery ───────────────────────────────────────────────
  const handleGallery = useCallback(async () => {
    const ok = await requestGalleryPermission();
    if (!ok) {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMyStories((prev) => [...prev, buildStory(result.assets[0])]);
    }
  }, [buildStory]);

  // ── Add Story sheet ───────────────────────────────────────
  const handleAddStory = useCallback(() => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo / Video", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) handleCamera();
          else if (idx === 2) handleGallery();
        },
      );
    } else {
      Alert.alert("Add Story", "Choose an option", [
        { text: "Take Photo / Video", onPress: handleCamera },
        { text: "Choose from Gallery", onPress: handleGallery },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }, [handleCamera, handleGallery]);

  // ── Open restaurant story ─────────────────────────────────
  const openStory = useCallback(
    (index: number) => {
      setActiveUserIndex(index);
      setViewerVisible(true);
      setSeenIds((prev) => {
        const next = new Set(prev);
        next.add(storyList[index].user_id);
        return next;
      });
    },
    [storyList],
  );

  const closeViewer = useCallback(() => {
    setViewerVisible(false);
    setActiveUserIndex(null);
  }, []);

  const goNextUser = useCallback(() => {
    setActiveUserIndex((prev) => {
      if (prev == null) return null;
      const next = prev + 1;
      if (next < storyList.length) {
        setSeenIds((s) => {
          const ns = new Set(s);
          ns.add(storyList[next].user_id);
          return ns;
        });
        return next;
      }
      setViewerVisible(false);
      return null;
    });
  }, [storyList]);

  const goPrevUser = useCallback(() => {
    setActiveUserIndex((prev) => {
      if (prev == null) return null;
      const next = prev - 1;
      if (next >= 0) return next;
      setViewerVisible(false);
      return null;
    });
  }, []);

  const activeUser: StoryUser | null =
    activeUserIndex != null ? storyList[activeUserIndex] : null;

  const myStoryUser: StoryUser = {
    user_id: MY_USER_ID,
    user_image: MY_PROFILE_IMAGE,
    user_name: "Your Story",
    stories: myStories,
  };

  return (
    <View style={mStyles.wrapper}>
      {/* <Text style={mStyles.sectionTitle}>Food Stories</Text> */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={mStyles.scrollContent}
      >
        {/* Add Story card — always first */}
        <AddStoryCard
          myStories={myStories}
          onAddPress={handleAddStory}
          onViewPress={() => setMyStoryOpen(true)}
        />

        {/* Restaurant story cards */}
        {storyList.map((item, index) => (
          <StoryCard
            key={item.user_id}
            item={item}
            seen={seenIds.has(item.user_id)}
            onPress={() => openStory(index)}
          />
        ))}
      </ScrollView>

      {/* My Story viewer */}
      <Modal
        visible={myStoryOpen && myStories.length > 0}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMyStoryOpen(false)}
      >
        <StoryViewer
          userStory={myStoryUser}
          onClose={() => setMyStoryOpen(false)}
          onNextUser={() => setMyStoryOpen(false)}
          onPrevUser={() => setMyStoryOpen(false)}
        />
      </Modal>

      {/* Restaurant Story viewer */}
      <Modal
        visible={viewerVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeViewer}
      >
        {activeUser != null && (
          <StoryViewer
            userStory={activeUser}
            onClose={closeViewer}
            onNextUser={goNextUser}
            onPrevUser={goPrevUser}
          />
        )}
      </Modal>
    </View>
  );
};

const mStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
});

export default StoryFeature;
