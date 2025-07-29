import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function HotelsScreen() {
  const [destination, setDestination] = useState('New York');
  const [checkinDate, setCheckinDate] = useState('2025-08-03');
  const [checkoutDate, setCheckoutDate] = useState('2025-08-05');
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://lite-api-six.vercel.app/api/hotels?countryCode=US&cityName=${encodeURIComponent(
          destination
        )}&checkin=${checkinDate}&checkout=${checkoutDate}&adults=${adults}`
      );
      if (!response.ok) throw new Error('Failed to fetch hotels');

      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const renderHotel = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedHotel(item)}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.price}>{item.currency} {item.price || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
      ) : hotels.length === 0 ? (
        <Text style={styles.noHotels}>No hotels found</Text>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          renderItem={renderHotel}
        />
      )}

      <Modal visible={!!selectedHotel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selectedHotel && (
              <>
                <Image source={{ uri: selectedHotel.thumbnail }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedHotel.name}</Text>
                <Text>{selectedHotel.hotelDescription}</Text>
                <Text>Stars: {selectedHotel.stars}</Text>
                <Text>Rating: {selectedHotel.rating}</Text>
                <TouchableOpacity onPress={() => setSelectedHotel(null)} style={styles.closeBtn}>
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
  card: { flexDirection: 'row', marginBottom: 10, backgroundColor: '#f8f8f8', borderRadius: 8, overflow: 'hidden' },
  thumbnail: { width: 100, height: 100 },
  info: { padding: 10, flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 14, color: '#666' },
  price: { fontSize: 14, color: 'green', marginTop: 5 },
  noHotels: { textAlign: 'center', color: 'red', marginTop: 20 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, margin: 10 },
  modalImage: { width: '100%', height: 200, marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  closeBtn: { marginTop: 20, backgroundColor: 'green', padding: 10, borderRadius: 5 },
  closeText: { color: '#fff', textAlign: 'center' },
});
