import FoodCarousel from "@/src/components/carousel/OnboardingCarousel";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "What actually healthy enough to eat?",
    subtitle:
      "Easily compare health scores and LDL breakdowns to see what to eat, what to avoid, and why.",
    bottomTitle: "Eat better.",
    bottomSubtitle: "Live longer",
    buttonLabel: "Let's Do It",
    images: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    ],
  },
  {
    id: "2",
    title: "Track every meal you eat daily",
    subtitle:
      "Log your meals and get instant health insights on calories, nutrients, and more.",
    bottomTitle: "Stay on track.",
    bottomSubtitle: "Feel amazing",
    buttonLabel: "Next",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    ],
  },
  {
    id: "3",
    title: "Find restaurants that match your goals",
    subtitle:
      "Discover healthy options near you based on your personal health profile.",
    bottomTitle: "Eat smart.",
    bottomSubtitle: "Live better",
    buttonLabel: "Get Started",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    ],
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  // const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = currentIndex === slides.length - 1;
  const current = slides[currentIndex];

  const handleNext = () => {
    if (isLast) {
      router.navigate("/signin");
      return;
    }
    const next = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.navigate("/signin")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Fixed Header */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      {/* Slide FlatList */}

      <FoodCarousel />

      {/* Bottom Text */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomTitle}>{current.bottomTitle}</Text>
        <Text style={styles.bottomSubtitle}>{current.bottomSubtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  skipText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  titleContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    minHeight: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    lineHeight: 32,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
  },
  slide: {
    width: width,
    alignItems: "center",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  imageSide: {
    width: width * 0.22,
    height: height * 0.28,
    borderRadius: 16,
    opacity: 0.75,
  },
  imageCenter: {
    width: width * 0.48,
    height: height * 0.36,
    borderRadius: 20,
  },
  bottomTextContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  bottomTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },
  bottomSubtitle: {
    fontSize: 15,
    color: "#888",
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  dotActive: {
    backgroundColor: "#111",
    width: 20,
  },
  button: {
    backgroundColor: "#101010",
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default OnboardingScreen;
