import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
     <Text style={styles.eyebrow}>
HMHC RESOURCE VAULT
</Text>
      <Text style={styles.title}>
Library
</Text>
      <Text style={styles.description}>
  Guides, recipes, nervous-system tools, sleep support,
  and The Hot Flash will live here.
</Text>
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