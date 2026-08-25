import { ReactNode, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type SectionCardProps = {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  summary?: string;
  emoji?: string;
  compact?: boolean;
};

export default function SectionCard({
  title,
  children,
  collapsible = false,
  defaultExpanded = true,
  summary,
  emoji,
  compact = false,
}: SectionCardProps) {

  const [isExpanded, setIsExpanded] =
    useState(defaultExpanded);

  const showContent =
    !collapsible || isExpanded;

  return (
    <View
  style={[
    styles.card,
    compact && styles.cardCompact,
  ]}>
      {collapsible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            expanded: isExpanded,
          }}
          onPress={() =>
            setIsExpanded(
              (currentValue) =>
                !currentValue,
            )
          }
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerPressed,
          ]}>
 <View style={styles.headerTextGroup}>
  <View style={styles.titleRow}>
    {emoji ? (
      <Text style={styles.emoji}>
        {emoji}
      </Text>
    ) : null}

    <Text style={styles.title}>
      {title}
    </Text>
  </View>

  {!isExpanded && summary ? (
    <Text style={styles.summary}>
      {summary}
    </Text>
  ) : null}
</View>

          <Text style={styles.chevron}>
  {isExpanded ? '▲' : '▼'}
</Text>
        </Pressable>
      ) : (
        <Text style={styles.title}>
          {title}
        </Text>
      )}

      {showContent && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  headerButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },

  headerPressed: {
    opacity: 0.8,
  },

  headerTextGroup: {
    flex: 1,
    gap: 4,
  },

  titleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.sm,
},

emoji: {
  fontSize: 20,
  lineHeight: 24,
  width: 26,
  textAlign: 'center',
},

  title: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700',
  },

  summary: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  chevron: {
  color: Colors.gold,
  fontSize: 13,
  fontWeight: '700',
},

  content: {
    gap: Spacing.sm,
  },

  cardCompact: {
  padding: Spacing.md,
  gap: Spacing.sm,
},
});