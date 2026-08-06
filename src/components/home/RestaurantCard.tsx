import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { HomeStyles } from "./home.style";

const getScoreColor = (score: number) => {
  if (score >= 80) return "#2A9D8F"; // সবুজ
  if (score >= 50) return "#F4A261"; // হলুদ/কমলা
  return "#E76F51"; // লাল
};

type RestaurantItem = {
  id: string;
  name: string;
  thumbnailImage: string;
  betterNotScore: number;
  grade: string | null;
};

const ScoreCircle = ({
  score,
  grade,
  color,
}: {
  score: number;
  grade: string | null;
  color: string;
}) => (
  <View style={[HomeStyles.scoreCircle, { borderColor: color }]}>
    <Text style={[HomeStyles.scoreNumber, { color }]}>{score}</Text>
    {grade ? (
      <Text style={[HomeStyles.scoreGrade, { color }]}>{grade}</Text>
    ) : null}
  </View>
);

const RestaurantCard = ({ item }: { item: RestaurantItem }) => {
  const color = getScoreColor(item.betterNotScore);

  return (
    <TouchableOpacity
      style={HomeStyles.card}
      onPress={() =>
        router.push({
          pathname: "/restaurant",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      {/* Logo/Thumbnail */}
      <View style={HomeStyles.logoContainer}>
        <Image
          source={{ uri: item.thumbnailImage }}
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
      </View>

      {/* Name */}
      <Text style={HomeStyles.name}>{item.name}</Text>

      {/* Score */}
      <ScoreCircle score={item.betterNotScore} grade={null} color={color} />
    </TouchableOpacity>
  );
};

export default RestaurantCard;
