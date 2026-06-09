import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const WEATHER_CODES = {
  0:  { label: 'Cerah',          emoji: '☀️'  },
  1:  { label: 'Cerah Berawan',  emoji: '🌤️' },
  2:  { label: 'Berawan Sebagian', emoji: '⛅' },
  3:  { label: 'Mendung',        emoji: '☁️'  },
  45: { label: 'Berkabut',       emoji: '🌫️' },
  51: { label: 'Gerimis Ringan', emoji: '🌦️' },
  53: { label: 'Gerimis Sedang', emoji: '🌦️' },
  55: { label: 'Gerimis Lebat',  emoji: '🌦️' },
  61: { label: 'Hujan Ringan',   emoji: '🌧️' },
  63: { label: 'Hujan Sedang',   emoji: '🌧️' },
  65: { label: 'Hujan Lebat',    emoji: '🌧️' },
  80: { label: 'Hujan Lokal',    emoji: '🌦️' },
  95: { label: 'Badai Petir',    emoji: '⛈️' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'Tidak Diketahui', emoji: '❓' };
}

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    if (!searchInput.trim()) {
      setWeatherData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Geocoding — nama kota → koordinat
        const geoUrl =
          `https://geocoding-api.open-meteo.com/v1/search` +
          `?name=${encodeURIComponent(searchInput)}&count=1&language=id`;
        const geoRes  = await fetch(geoUrl, { signal: controller.signal });
        const geoJson = await geoRes.json();

        if (!geoJson.results || geoJson.results.length === 0) {
          throw new Error(`Kota "${searchInput}" tidak ditemukan`);
        }

        const loc = geoJson.results[0];

        // Step 2: Forecast — koordinat → cuaca
        const cuacaUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${loc.latitude}&longitude=${loc.longitude}` +
          `&current_weather=true`;
        const cuacaRes  = await fetch(cuacaUrl, { signal: controller.signal });
        const cuacaJson = await cuacaRes.json();

        setWeatherData({
          kota:   loc.name,
          negara: loc.country,
          suhu:   cuacaJson.current_weather.temperature,
          angin:  cuacaJson.current_weather.windspeed,
          kode:   cuacaJson.current_weather.weathercode,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setWeatherData(null);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchInput]);

  const info = weatherData ? getWeatherInfo(weatherData.kode) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🌦️ WeatherFinder</Text>
      <Text style={styles.subtitle}>Cari cuaca real-time di kota mana pun</Text>

      <TextInput
        style={styles.input}
        placeholder="Ketik nama kota (cth: Jakarta)"
        placeholderTextColor="#999"
        value={searchInput}
        onChangeText={setSearchInput}
        autoCorrect={false}
      />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00b894" />
          <Text style={styles.loadingText}>Mencari cuaca...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {weatherData && !loading && !error && (
        <View style={styles.resultCard}>
          <Text style={styles.cityName}>{weatherData.kota}</Text>
          <Text style={styles.country}>{weatherData.negara}</Text>
          <Text style={styles.emoji}>{info.emoji}</Text>
          <Text style={styles.temp}>{weatherData.suhu}°C</Text>
          <Text style={styles.weatherLabel}>{info.label}</Text>
          <View style={styles.divider} />
          <Text style={styles.windText}>💨 Angin: {weatherData.angin} km/jam</Text>
        </View>
      )}

      {!searchInput && !loading && (
        <View style={styles.center}>
          <Text style={styles.hint}>🔍 Mulai ketik nama kota di atas</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0a2e0a' },
  content:      { padding: 24, paddingTop: 60, minHeight: '100%' },
  title:        { fontSize: 30, fontWeight: '700', color: '#00b894', textAlign: 'center' },
  subtitle:     { fontSize: 13, color: '#9fd8c5', textAlign: 'center', marginTop: 4 },
  input: {
    borderWidth: 2, borderColor: '#00b894', borderRadius: 10,
    padding: 14, fontSize: 16, backgroundColor: '#fff',
    color: '#000', marginTop: 24,
  },
  center:       { alignItems: 'center', marginTop: 40 },
  loadingText:  { color: '#9fd8c5', marginTop: 12, fontSize: 14 },
  hint:         { color: '#9fd8c5', fontSize: 15 },
  errorCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20,
    marginTop: 28, borderLeftWidth: 5, borderLeftColor: '#d32f2f',
  },
  errorText:    { color: '#d32f2f', fontSize: 15, fontWeight: '600' },
  resultCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28,
    marginTop: 28, alignItems: 'center',
  },
  cityName:     { fontSize: 26, fontWeight: '700', color: '#0a2e0a' },
  country:      { fontSize: 14, color: '#888', marginTop: 2 },
  emoji:        { fontSize: 64, marginVertical: 12 },
  temp:         { fontSize: 48, fontWeight: '700', color: '#00b894' },
  weatherLabel: { fontSize: 18, color: '#555', marginTop: 4 },
  divider:      { height: 1, backgroundColor: '#eee', alignSelf: 'stretch', marginVertical: 16 },
  windText:     { fontSize: 15, color: '#555' },
});