import { router } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';

export default function TrackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MOOD RING</Text>
      <Text style={styles.title}>Track</Text>
      <Text style={styles.description}>
        Your cycle, moods, symptoms, sleep, and supplements will live here.
      </Text>

<Pressable
  onPress={() => {
    router.push('/track');
  }}
  style={{
    marginTop: 12,
    paddingVertical: 10,
  }}>
  <Text
    style={{
      color: '#D4AF37',
      fontSize: 16,
      fontWeight: '700',
    }}>
    Open My Rhythm
  </Text>
</Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 17,
    lineHeight: 25,
  },
});