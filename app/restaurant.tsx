import { useGetRestaurantByIdQuery } from "@/src/redux/features/restaurants/restaurant.api";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const getScoreColor = (score: number) => {
  if (score >= 80) return "#2A9D8F"; // সবুজ
  if (score >= 50) return "#F4A261"; // হলুদ/কমলা
  return "#E76F51"; // লাল
};

const RestaurantScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: restaurant,
    isLoading,
    isError,
  } = useGetRestaurantByIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (isError || !restaurant) {
    return (
      <View style={styles.centered}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const scoreColor = getScoreColor(restaurant.betterNotScore);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Image
          source={{ uri: restaurant.thumbnailImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.category}>{restaurant.location}</Text>
          </View>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>
              {restaurant.betterNotScore}
            </Text>
          </View>
        </View>

        {restaurant.grade ? (
          <View
            style={[styles.gradeBadge, { backgroundColor: scoreColor + "20" }]}
          >
            <Text style={[styles.gradeText, { color: scoreColor }]}>
              {restaurant.grade}
            </Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Menu</Text>

        {restaurant.menu?.length ? (
          restaurant.menu.map((item: any) => {
            const itemColor = getScoreColor(item.betterNotScore);
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <Image
                  source={{ uri: item.thumbnailImage }}
                  style={styles.menuImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {/* <Text style={styles.menuName}>
                    {item.emoji} {item.item}
                  </Text> */}
                  <Text style={styles.menuType}>{item.type}</Text>
                  <Text style={styles.menuCalories}>{item.calories} kcal</Text>
                </View>
                <View
                  style={[styles.menuScoreCircle, { borderColor: itemColor }]}
                >
                  <Text style={[styles.menuScoreText, { color: itemColor }]}>
                    {item.betterNotScore}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No menu items available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  coverImage: { width: "100%", height: 220 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  infoContainer: { padding: 20 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  name: { fontSize: 20, fontWeight: "800", color: "#111" },
  category: { fontSize: 13, color: "#888", marginTop: 2 },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: { fontSize: 16, fontWeight: "800" },
  gradeBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  gradeText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  menuImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  menuName: { fontSize: 15, fontWeight: "600", color: "#111" },
  menuType: { fontSize: 12, color: "#888", marginTop: 2 },
  menuCalories: { fontSize: 13, color: "#666", marginTop: 4 },
  menuScoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  menuScoreText: { fontSize: 12, fontWeight: "700" },
  emptyText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});

export default RestaurantScreen;
