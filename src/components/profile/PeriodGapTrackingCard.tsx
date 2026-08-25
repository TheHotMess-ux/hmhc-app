import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function PeriodGapTrackingCard({
  value,
  onChange,
}: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{
        checked: value,
      }}
      accessibilityLabel="Track time since my last period"
      onPress={() => onChange(!value)}
      style={({ pressed }) => [
        styles.card,
        value && styles.cardSelected,
        pressed && styles.pressed,
      ]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          OPTIONAL PERIOD TIMELINE
        </Text>

        <Text style={styles.title}>
          Track time since my last period
        </Text>

        <Text style={styles.description}>
          Keep simple bleeding records and see
          how long it has been since your last
          logged period. Cycle phases and
          predictions will stay hidden.
        </Text>

        {value && (
          <Text style={styles.note}>
            This timeline is not a prediction or
            menopause diagnosis.
          </Text>
        )}
      </View>

      <View
        style={[
          styles.switchTrack,
          value && styles.switchTrackSelected,
        ]}>
        <View
          style={[
            styles.switchThumb,
            value && styles.switchThumbSelected,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  cardSelected: {
    borderColor: Colors.gold,
  },

  content: {
    flex: 1,
    gap: Spacing.xs,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  note: {
    color: Colors.goldLight,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },

  switchTrack: {
    width: 48,
    height: 28,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    justifyContent: 'center',
  },

  switchTrackSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  switchThumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.textSecondary,
    borderRadius: 10,
  },

  switchThumbSelected: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.background,
  },

  pressed: {
    opacity: 0.7,
  },
});