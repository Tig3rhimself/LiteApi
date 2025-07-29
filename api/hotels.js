import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { fetchHotels } from '../services/fetchHotels'; // Adjust path if needed

export default function HotelsScreen() {
  const [destination, setDestination] = useState('New York');
  const [checkinDate, setCheckinDate] = useState('2025-08-03');
  const [checkoutDate, setCheckoutDate] = useState('2025-08-05');
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    const results = await fetchHotels(destination, 'US', checkinDate, checkoutDate, adults);
    setHotels(results);
    setLoading(false);
  };

  const renderHotel = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedHotel(item)}>
      <Image
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/100' }}
        style={styles.thumbnail}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.price}>
          {item.price !== 'N/A' ? `$${item.price}` : 'Price unavailable'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Form */}
      <TextInput
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
        placeholder="Destination"
      />
      <TextInput
        style={styles.input}
        value={checkinDate}
        onChangeText={setCheckinDate}
        placeholder="Check-in Date (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={checkoutDate}
        onChangeText={setCheckoutDate}
        placeholder="Check-out Date (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={adults.toString()}
        onChangeText={(val) => setAdults(parseInt(val) || 1)}
        placeholder="Adults"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchText}>Search Hotels</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />}

      {!loading && hotels.length === 0 && (
        <Text style={styles.noResults}>No hotels found. Try another city.</Text>
      )}

      {!loading && hotels.length > 0 && (
        <FlatList data={hotels} renderItem={renderHotel} keyExtractor={(item) => item.id} />
      )}

      {/* Hotel Detail Modal */}
      <Modal visible={!!selectedHotel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selectedHotel && (
              <>
                <Image
                  source={{ uri: selectedHotel.thumbnail || 'https://via.placeholder.com/300' }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedHotel.name}</Text>
                <Text>{selectedHotel.hotelDescription || 'No description available.'}</Text>
                <Text>Stars: {selectedHotel.stars || 'N/A'}</Text>
                <Text>Rating: {selectedHotel.rating || 'N/A'}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedHotel(null)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: { width: 100, height: 100 },
  info: { padding: 10, flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 14, color: '#666' },
  price: { fontSize: 14, color: 'green', marginTop: 5 },
  noResults: { textAlign: 'center', color: 'red', marginTop: 20 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, margin: 10 },
  modalImage: { width: '100%', height: 200, marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  closeBtn: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  closeText: { color: '#fff', textAlign: 'center' },
});
