import { useGetRestaurantsQuery } from "@/src/redux/features/restaurants/restaurant.api";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { HomeStyles } from "./home.style";
import RestaurantCard from "./RestaurantCard";

const HomeBody = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isLoading, isError, refetch } = useGetRestaurantsQuery({});

  const restaurants = data?.data ?? []; // { meta, data: [...] } থেকে data অ্যারে বের করা

  const filteredRestaurants = restaurants.filter((restaurant: any) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 40 }}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingVertical: 40, alignItems: "center" }}>
        <Text>Something went wrong loading restaurants.</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={HomeStyles.sectionTitle}>Top Restaurant</Text>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No restaurants found
          </Text>
        }
      />
    </>
  );
};

export default HomeBody;
