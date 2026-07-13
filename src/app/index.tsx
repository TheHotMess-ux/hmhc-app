import { ScrollView, StyleSheet, Text, View } from 'react-native';

import SectionCard from '@/components/SectionCard';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          THE HOT MESS HORMONE CLUB
        </Text>

        <Text style={styles.greeting}>
          Good morning, Sheena
        </Text>

        <Text style={styles.subtitle}>
          Your body has notes today.
        </Text>
      </View>

      <SectionCard title="Today's Hormone Briefing">
        <Text style={styles.bodyText}>
          Your daily hormone update will appear here based on your cycle,
          symptoms, and personal tracking history.
        </Text>
      </SectionCard>

      <SectionCard title="Today's Pep Talk">
        <Text style={styles.pepTalk}>
          You do not need to conquer the entire week today. One useful thing
          is plenty.
        </Text>
      </SectionCard>

      <SectionCard title="Quick Log">
        <Text style={styles.bodyText}>
          Mood · Symptoms · Supplements · Sleep
        </Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 48,
  },
  header: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  greeting: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  bodyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  pepTalk: {
    color: Colors.cream,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
});