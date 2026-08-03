import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  emoji?: string;
  label: string;
  value: string;
  secondaryValue?: string;
  accentColor?: string;
};

export default function InfoRow({
  emoji,
  label,
  value,
  secondaryValue,
  accentColor,
}: Props) {
  return (
    <View style={styles.row}>
      {emoji && (
        <View style={styles.iconWrap}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      )}

      <View style={styles.textGroup}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text
          style={[
            styles.value,
            accentColor && {
              color: accentColor,
            },
          ]}>
          {value}
        </Text>

        {secondaryValue && (
          <Text style={styles.secondaryValue}>
            {secondaryValue}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emoji: {
    fontSize: 20,
  },

  textGroup: {
    flex: 1,
    gap: 3,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  value: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },

  secondaryValue: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});