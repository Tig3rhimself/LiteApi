import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';

export default function HotelsScreen() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://lite-api-six.vercel.app/api/hotels?countryCode=US&cityName=${encodeURIComponent(destination)}`
      );
      const data = await response.json();
      setHotels(data.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!destination) return;
    fetchHotels();
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Search Section */}
      <TextInput
        placeholder="Where are you going?"
        value={destination}
        onChangeText={setDestination}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10
        }}
      />
      <TextInput
        placeholder="Check-in Date (YYYY-MM-DD)"
        value={checkIn}
        onChangeText={setCheckIn}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10
        }}
      />
      <TextInput
        placeholder="Check-out Date (YYYY-MM-DD)"
        value={checkOut}
        onChangeText={setCheckOut}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10
        }}
      />
      <TextInput
        placeholder="Guests"
        value={guests.toString()}
        onChangeText={(val) => setGuests(parseInt(val) || 1)}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
        onPress={handleSearch}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Search</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />}

      {/* Hotel Results */}
      {!loading && hotels.length > 0 && (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              onPress={() => handleHotelSelect(item)}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={{ width: '100%', height: 200, borderRadius: 10 }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>
                {item.name}
              </Text>
              <Text>{item.city}</Text>
              <Text>${item.price || 'N/A'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Hotel Detail Modal */}
      <Modal visible={!!selectedHotel} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}
        >
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '100%' }}>
            <ScrollView>
              {selectedHotel && (
                <>
                  <Image
                    source={{ uri: selectedHotel.thumbnail }}
                    style={{ width: '100%', height: 200, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 10 }}>
                    {selectedHotel.name}
                  </Text>
                  <Text>{selectedHotel.hotelDescription || 'No description available.'}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedHotel(null)}
                    style={{
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                      marginTop: 20
                    }}
                  >
                    <Text style={{ color: 'white' }}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
