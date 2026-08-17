import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import PremiumGate from '@/components/premium/PremiumGate';

import type {
    AdvancedPatternsSummary,
} from '@/lib/advancedPatterns';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  summary: AdvancedPatternsSummary;
  rangeDays: number;
};

export default function AdvancedPatternsCard({
  summary,
  rangeDays,
}: Props) {
  return (
    <PremiumGate
      feature="advancedPatterns"
      title="See what keeps showing up"
      description="Connect repeated symptoms with sleep, mood, and bleeding patterns across your logs.">
      <View style={styles.section}>
        <View style={styles.headingGroup}>
          <Text style={styles.eyebrow}>
            PREMIUM PATTERN INTELLIGENCE
          </Text>

          <Text style={styles.title}>
            Advanced Patterns
          </Text>

          <Text style={styles.description}>
            Connections found across your last{' '}
            {rangeDays} days of logged information.
            Patterns are observations—not diagnoses.
          </Text>
        </View>

        {!summary.hasEnoughData ? (
          <View style={styles.learningCard}>
            <Text style={styles.learningEmoji}>
              🌱
            </Text>

            <View style={styles.learningTextGroup}>
              <Text style={styles.learningTitle}>
                Learning your patterns
              </Text>

              <Text style={styles.learningText}>
                HMHC has {summary.loggedDays} of the{' '}
                {summary.minimumDays} logged days needed
                to begin identifying repeated signals.
              </Text>
            </View>
          </View>
        ) : summary.patterns.length === 0 ? (
          <View style={styles.learningCard}>
            <Text style={styles.learningEmoji}>
              🔎
            </Text>

            <View style={styles.learningTextGroup}>
              <Text style={styles.learningTitle}>
                No repeated pattern yet
              </Text>

              <Text style={styles.learningText}>
                That is still useful information. Keep
                checking in and HMHC will watch for
                connections without inventing any.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.patternList}>
            {summary.patterns.map((pattern) => (
              <View
                key={pattern.id}
                style={styles.patternCard}>
                <Text style={styles.patternEyebrow}>
                  {pattern.eyebrow}
                </Text>

                <Text style={styles.patternTitle}>
                  {pattern.title}
                </Text>

                <Text style={styles.patternMessage}>
                  {pattern.message}
                </Text>

                <View style={styles.evidenceBadge}>
                  <Text style={styles.evidenceText}>
                    {pattern.evidence}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },

  headingGroup: {
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
    fontSize: 24,
    fontWeight: '800',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  learningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  learningEmoji: {
    fontSize: 28,
  },

  learningTextGroup: {
    flex: 1,
    gap: Spacing.xs,
  },

  learningTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  learningText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  patternList: {
    gap: Spacing.md,
  },

  patternCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  patternEyebrow: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  patternTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },

  patternMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  evidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  evidenceText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
  },
});