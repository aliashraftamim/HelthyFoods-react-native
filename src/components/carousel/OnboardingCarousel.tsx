// ─────────────────────────────────────────────────────────────
// FoodCarousel.tsx
// Professional 3D-perspective food carousel
// Center card is large, side cards are smaller & dimmed
// Smooth snap scrolling — no extra packages needed
// ─────────────────────────────────────────────────────────────

import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

// ── Sizing ────────────────────────────────────────────────
const CARD_WIDTH = SW * 0.58; // center card width
const CARD_HEIGHT = CARD_WIDTH * 1.72; // tall portrait ratio
const SIDE_SCALE = 0.82; // side card scale factor
const SIDE_CARD_WIDTH = CARD_WIDTH * SIDE_SCALE;
const SPACING = 12;
const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;

// side padding so center card truly centers
const SIDE_PADDING = (SW - CARD_WIDTH) / 2;

// ── Data ──────────────────────────────────────────────────
export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
    title: "Avocado Toast",
    subtitle: "Poached egg · Sourdough",
    tag: "Breakfast",
    tagColor: "#F4A261",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600",
    title: "BBQ Platter",
    subtitle: "Ribs · Wings · Fries",
    tag: "Grill",
    tagColor: "#E63946",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    title: "Prime Steak",
    subtitle: "Rosemary · Sea Salt",
    tag: "Premium",
    tagColor: "#2A9D8F",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    title: "Pepperoni Pizza",
    subtitle: "Wood fired · Fresh basil",
    tag: "Popular",
    tagColor: "#8338EC",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    title: "Sushi Platter",
    subtitle: "Salmon · Dragon Roll",
    tag: "Japanese",
    tagColor: "#3A86FF",
  },
];

// ── Single Card ───────────────────────────────────────────
interface CardProps {
  item: CarouselItem;
  index: number;
  scrollX: Animated.Value;
  onPress: (item: CarouselItem) => void;
}

const CarouselCard: React.FC<CardProps> = ({
  item,
  index,
  scrollX,
  onPress,
}) => {
  const inputRange = [
    (index - 1) * FULL_ITEM_WIDTH,
    index * FULL_ITEM_WIDTH,
    (index + 1) * FULL_ITEM_WIDTH,
  ];

  // Scale: center = 1, sides = SIDE_SCALE
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [SIDE_SCALE, 1, SIDE_SCALE],
    extrapolate: "clamp",
  });

  // Opacity: center = 1, sides = 0.55
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.55, 1, 0.55],
    extrapolate: "clamp",
  });

  // translateY: center card floats up slightly
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [16, 0, 16],
    extrapolate: "clamp",
  });

  // Text slide in from bottom for active card
  const textTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [20, 0, 20],
    extrapolate: "clamp",
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.92}
      style={styles.cardWrapper}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        {/* Food image */}
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Tag badge */}
        <View style={[styles.tagBadge, { backgroundColor: item.tagColor }]}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>

        {/* Bottom text */}
        <Animated.View
          style={[
            styles.cardBottom,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>

          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => onPress(item)}
          ></TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── Dot Indicator ─────────────────────────────────────────
interface DotProps {
  index: number;
  total: number;
  scrollX: Animated.Value;
}

const DotIndicator: React.FC<DotProps> = ({ index, total, scrollX }) => {
  const inputRange = [
    (index - 1) * FULL_ITEM_WIDTH,
    index * FULL_ITEM_WIDTH,
    (index + 1) * FULL_ITEM_WIDTH,
  ];

  const width = scrollX.interpolate({
    inputRange,
    outputRange: [6, 22, 6],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.35, 1, 0.35],
    extrapolate: "clamp",
  });

  return <Animated.View style={[styles.dot, { width, opacity }]} />;
};

// ── Main Carousel ─────────────────────────────────────────
interface FoodCarouselProps {
  items?: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
  title?: string;
  subtitle?: string;
}

const FoodCarousel: React.FC<FoodCarouselProps> = ({
  items = DEFAULT_ITEMS,
  onItemPress,
  title = "Featured Dishes",
  subtitle = "Handpicked for you today",
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePress = useCallback(
    (item: CarouselItem) => {
      onItemPress?.(item);
    },
    [onItemPress],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const getItemLayout = useCallback(
    (_: ArrayLike<CarouselItem> | null | undefined, index: number) => ({
      length: FULL_ITEM_WIDTH,
      offset: FULL_ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => (
      <CarouselCard
        item={item}
        index={index}
        scrollX={scrollX}
        onPress={handlePress}
      />
    ),
    [scrollX, handlePress],
  );

  const keyExtractor = useCallback((item: CarouselItem) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        contentContainerStyle={{
          paddingHorizontal: SIDE_PADDING - SPACING / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
        bounces={true}
        overScrollMode="never"
      />

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {items.map((_, i) => (
          <DotIndicator
            key={i}
            index={i}
            total={items.length}
            scrollX={scrollX}
          />
        ))}
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 28,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 22,
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 3,
  },
  seeAllBtn: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  seeAllText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
  },

  // Card
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Simulated gradient: transparent top, dark bottom
    backgroundColor: "transparent",
    // Use multiple layers for a nice gradient feel
  },

  // Tag badge
  tagBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  // Card bottom content
  cardBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 22,
    // dark scrim
    backgroundColor: "rgba(0,0,0,0.62)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 14,
  },
  orderBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  orderBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B35",
  },
});

export default FoodCarousel;
