import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { restaurants } from '../../components/home/helper.home';
import { RootStackParamList } from '../../navigation/types';

type RestaurantRouteProp = RouteProp<RootStackParamList, 'Restaurant'>;

const RestaurantScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RestaurantRouteProp>();
  const restaurant = restaurants.find(r => r.id === route.params.id);

  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cover Image */}
      <View>
        <Image
          source={{ uri: restaurant.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {/* Logo + Name + Score */}
        <View style={styles.nameRow}>
          <Image source={{ uri: restaurant.logo }} style={styles.logo} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.category}>{restaurant.category}</Text>
          </View>
          <View style={[styles.scoreCircle, { borderColor: restaurant.color }]}>
            <Text style={[styles.scoreNumber, { color: restaurant.color }]}>
              {restaurant.score}
            </Text>
            <Text style={[styles.scoreGrade, { color: restaurant.color }]}>
              {restaurant.grade}
            </Text>
          </View>
        </View>

        {/* Tags Row */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <MaterialIcons name="star" size={14} color="#F4A261" />
            <Text style={styles.tagText}>{restaurant.rating} Rating</Text>
          </View>
          <View style={styles.tag}>
            <MaterialIcons name="access-time" size={14} color="#666" />
            <Text style={styles.tagText}>{restaurant.deliveryTime}</Text>
          </View>
          <View style={styles.tag}>
            <MaterialIcons name="delivery-dining" size={14} color="#666" />
            <Text style={styles.tagText}>{restaurant.deliveryFee}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{restaurant.description}</Text>

        <View style={styles.divider} />

        {/* Address + Phone */}
        <View style={styles.contactRow}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.contactText}>{restaurant.address}</Text>
        </View>
        <View style={styles.contactRow}>
          <MaterialIcons name="phone" size={16} color="#666" />
          <Text style={styles.contactText}>{restaurant.phone}</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu */}
        <Text style={styles.sectionTitle}>Popular Items</Text>
        {restaurant.menu.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuEmoji}>
              <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>৳ {item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coverImage: { width: '100%', height: 250 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  infoContainer: { padding: 20 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  name: { fontSize: 20, fontWeight: '800', color: '#111' },
  category: { fontSize: 13, color: '#888', marginTop: 2 },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: { fontSize: 14, fontWeight: '800' },
  scoreGrade: { fontSize: 9, fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  tagText: { fontSize: 12, color: '#555', fontWeight: '500' },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: { fontSize: 14, color: '#555' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  menuEmoji: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  menuPrice: { fontSize: 13, color: '#666' },
  addButton: {
    backgroundColor: '#101010',
    borderRadius: 8,
    padding: 6,
  },
});

export default RestaurantScreen;
