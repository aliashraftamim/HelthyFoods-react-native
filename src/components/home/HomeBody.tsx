import React from "react";
import { FlatList, Text } from "react-native";
import { restaurants } from "../home/helper.home";
import { HomeStyles } from "./home.style";
import RestaurantCard from "./RestaurantCard";

const HomeBody = ({ searchQuery }: { searchQuery: string }) => {
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Text style={HomeStyles.sectionTitle}>Top Restaurant</Text>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </>
  );
};

export default HomeBody;
