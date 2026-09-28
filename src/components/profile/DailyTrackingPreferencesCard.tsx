import {
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  tracksCaffeine: boolean;
  tracksAlcohol: boolean;
  onCaffeineChange: (
    value: boolean,
  ) => void;
  onAlcoholChange: (
    value: boolean,
  ) => void;
};

export default function DailyTrackingPreferencesCard({
  tracksCaffeine,
  tracksAlcohol,
  onCaffeineChange,
  onAlcoholChange,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Daily Tracking
      </Text>

      <Text style={styles.description}>
        Choose which optional items appear in
        your Quick Log.
      </Text>

      <View style={styles.option}>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>
            ☕ Caffeine
          </Text>

          <Text style={styles.optionDescription}>
            Show caffeine tracking in Quick Log.
          </Text>
        </View>

        <Switch
  accessibilityLabel="Caffeine tracking"
  value={tracksCaffeine}
  onValueChange={onCaffeineChange}
  trackColor={{
    false: Colors.border,
    true: Colors.gold,
  }}
  thumbColor={
  tracksCaffeine
    ? '#F5F0E6'
    : Colors.textSecondary
}
/>
      </View>

      <View style={styles.divider} />

      <View style={styles.option}>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>
            🍷 Alcohol
          </Text>

          <Text style={styles.optionDescription}>
            Show alcohol tracking in Quick Log.
          </Text>
        </View>

       <Switch
  accessibilityLabel="Alcohol tracking"
  value={tracksAlcohol}
  onValueChange={onAlcoholChange}
  trackColor={{
    false: Colors.border,
    true: Colors.gold,
  }}
  thumbColor={
  tracksAlcohol
    ? '#F5F0E6'
    : Colors.textSecondary
}
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  title: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: '900',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  optionText: {
    flex: 1,
    gap: 4,
  },

  optionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  optionDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});