import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import SectionCard from '@/components/SectionCard';

type CycleTrendMessage = {
  title: string;
  body: string;
};

type Props = {
  showsCycleTracking: boolean;
  cycleLengthHistory: number[];
  recentCycleLengths: number[];
  averageCycleLength: number | null;
  shortestCycle: number | null;
  longestCycle: number | null;
  cycleVariation: number | null;
  cycleTrendMessage:
    | CycleTrendMessage
    | null;
};

export default function CycleHistoryCard({
  showsCycleTracking,
  cycleLengthHistory,
  recentCycleLengths,
  averageCycleLength,
  shortestCycle,
  longestCycle,
  cycleVariation,
  cycleTrendMessage,
}: Props) {
  if (!showsCycleTracking) {
    return null;
  }

  const hasCycleHistory =
    cycleLengthHistory.length >= 2;

    const hasCyclePattern =
  averageCycleLength !== null &&
  shortestCycle !== null &&
  longestCycle !== null;

  const cycleHistorySummary =
  hasCyclePattern
    ? `Average ${averageCycleLength} days · Range ${shortestCycle}–${longestCycle} days`
    : `${cycleLengthHistory.length} completed ${
        cycleLengthHistory.length === 1
          ? 'cycle'
          : 'cycles'
      } logged`;

  if (!hasCycleHistory && !hasCyclePattern) {
    return null;
  }

 return (
  <SectionCard
    title="Cycle History"
    emoji="🔄"
    collapsible
    defaultExpanded={false}
    summary={cycleHistorySummary}>

      {hasCycleHistory && (
        <View style={styles.cycleHistoryCard}>
          <Text style={styles.cycleHistoryEyebrow}>
            CYCLE HISTORY
          </Text>

          <Text style={styles.cycleHistoryTitle}>
            Your recent completed cycles
          </Text>

          <Text style={styles.cycleHistoryText}>
            {cycleLengthHistory
              .slice(-4)
              .map(
                (length) =>
                  `${length} days`,
              )
              .join(' • ')}
          </Text>

          <Text style={styles.cycleHistoryNote}>
            Based on your logged period start
            dates.
          </Text>
        </View>
      )}

      {hasCyclePattern && (
        <View style={styles.cyclePatternCard}>
          <Text style={styles.cyclePatternEyebrow}>
            YOUR CYCLE PATTERN
          </Text>

          <Text style={styles.cyclePatternTitle}>
            Here&apos;s what your recent cycles
            are showing
          </Text>

          <View style={styles.cyclePatternGrid}>
            <View style={styles.cyclePatternItem}>
              <Text
                style={
                  styles.cyclePatternLabel
                }>
                Average
              </Text>

              <Text
                style={
                  styles.cyclePatternValue
                }>
                {averageCycleLength} days
              </Text>
            </View>

            <View style={styles.cyclePatternItem}>
              <Text
                style={
                  styles.cyclePatternLabel
                }>
                Recent range
              </Text>

              <Text
                style={
                  styles.cyclePatternValue
                }>
                {shortestCycle}–{longestCycle}{' '}
                days
              </Text>
            </View>
          </View>

          {recentCycleLengths.length >= 3 &&
            cycleVariation !== null && (
              <View style={styles.variabilityCard}>
                <Text
                  style={
                    styles.variabilityTitle
                  }>
                  Your recent cycles have varied
                  by {cycleVariation} days.
                </Text>

                <Text
                  style={
                    styles.variabilityText
                  }>
                  Cycle length can shift over time,
                  especially during perimenopause.
                  We&apos;ll keep tracking your
                  pattern as you log more cycles.
                </Text>
              </View>
            )}

          {cycleTrendMessage && (
            <View style={styles.trendCard}>
              <Text style={styles.trendTitle}>
                {cycleTrendMessage.title}
              </Text>

              <Text style={styles.trendText}>
                {cycleTrendMessage.body}
              </Text>
            </View>
          )}

          <Text style={styles.cyclePatternNote}>
            Based on your most recent completed
            cycles. We&apos;ll learn more about
            your pattern as you keep logging.
          </Text>
        </View>
      )}
</SectionCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  cycleHistoryCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  cycleHistoryEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  cycleHistoryTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  cycleHistoryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },

  cycleHistoryNote: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  cyclePatternCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  cyclePatternEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  cyclePatternTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  cyclePatternGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  cyclePatternItem: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: Spacing.md,
    gap: 6,
  },

  cyclePatternLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  cyclePatternValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  cyclePatternNote: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  variabilityCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: Spacing.md,
    gap: 6,
  },

  variabilityTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  variabilityText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  trendCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: Spacing.md,
    gap: 6,
  },

  trendTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  trendText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});