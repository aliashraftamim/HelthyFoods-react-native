/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '../../navigation/AppNavigator';
import { restaurants } from '../home/helper.home';
import { HomeStyles } from './home.style';

const ScoreCircle = ({
  score,
  grade,
  color,
}: {
  score: number;
  grade: string;
  color: string;
}) => (
  <View style={[HomeStyles.scoreCircle, { borderColor: color }]}>
    <Text style={[HomeStyles.scoreNumber, { color }]}>{score}</Text>
    <Text style={[HomeStyles.scoreGrade, { color }]}>{grade}</Text>
  </View>
);

const RestaurantCard = ({ item }: { item: (typeof restaurants)[0] }) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
      style={HomeStyles.card}
      onPress={() => navigation.navigate('Restaurant', { id: item.id })}
      activeOpacity={0.8}
    >
      {/* Logo */}
      <View style={HomeStyles.logoContainer}>
        <Image
          source={{ uri: item.logo }}
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
      </View>

      {/* Name */}
      <Text style={HomeStyles.name}>{item.name}</Text>

      {/* Score */}
      <ScoreCircle score={item.score} grade={item.grade} color={item.color} />
    </TouchableOpacity>
  );
};

export default RestaurantCard;
