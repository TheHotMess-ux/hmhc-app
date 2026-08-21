import { useState } from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    PredictionReadiness,
} from '@/lib/cyclePrediction';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type ExpandedEstimate =
  | 'fertile'
  | 'period'
  | null;

type Props = {
  showsCycleTracking: boolean;
  predictionReadiness: PredictionReadiness;
  estimatedOvulationDate?: string;
  fertileWindowStart?: string;
  fertileWindowEnd?: string;
  predictedPeriodDate?: string;
  predictedWindowStart?: string;
  predictedWindowEnd?: string;
};

export default function CycleEstimatesCard({
  showsCycleTracking,
  predictionReadiness,
  estimatedOvulationDate,
  fertileWindowStart,
  fertileWindowEnd,
  predictedPeriodDate,
  predictedWindowStart,
  predictedWindowEnd,
}: Props) {
  const [
    expandedEstimate,
    setExpandedEstimate,
  ] = useState<ExpandedEstimate>(null);

  if (!showsCycleTracking) {
    return null;
  }

  if (predictionReadiness !== 'ready') {
    return (
      <View style={styles.predictionCard}>
        <Text style={styles.predictionEyebrow}>
          NEXT PERIOD ESTIMATE
        </Text>

        <Text style={styles.predictionTitle}>
          🌱 Learning your rhythm
        </Text>

        <Text style={styles.predictionNote}>
          {predictionReadiness === 'not-started'
            ? 'Log the first day of your period to begin cycle tracking.'
            : 'Keep logging your period starts. Once we have enough completed cycles, we can begin estimating your next period window.'}
        </Text>
      </View>
    );
  }

  const hasCompletePrediction =
    estimatedOvulationDate &&
    fertileWindowStart &&
    fertileWindowEnd &&
    predictedPeriodDate &&
    predictedWindowStart &&
    predictedWindowEnd;

  if (!hasCompletePrediction) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.predictionCard}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View estimated fertile window"
          accessibilityState={{
            expanded:
              expandedEstimate === 'fertile',
          }}
          onPress={() =>
            setExpandedEstimate((current) =>
              current === 'fertile'
                ? null
                : 'fertile',
            )
          }
          style={({ pressed }) => [
            styles.estimateHeader,
            pressed && styles.estimatePressed,
          ]}>
          <Text style={styles.estimateIcon}>
            🌸
          </Text>

          <View style={styles.estimateText}>
            <Text style={styles.predictionEyebrow}>
              ESTIMATED FERTILE WINDOW
            </Text>

            <Text style={styles.estimateSummary}>
              {fertileWindowStart} –{' '}
              {fertileWindowEnd}
            </Text>
          </View>

          <Text style={styles.estimateToggle}>
            {expandedEstimate === 'fertile'
              ? '−'
              : '+'}
          </Text>
        </Pressable>

        {expandedEstimate === 'fertile' && (
          <View style={styles.estimateDetails}>
            <View style={styles.predictionWindow}>
              <Text
                style={
                  styles.predictionWindowLabel
                }>
                Estimated ovulation
              </Text>

              <Text
                style={
                  styles.predictionWindowValue
                }>
                Around {estimatedOvulationDate}
              </Text>
            </View>

            <Text style={styles.predictionNote}>
              Based on your recent cycle history.
              Perimenopause can shift ovulation,
              so this estimate should not be used
              as birth control.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.predictionCard}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View next period estimate"
          accessibilityState={{
            expanded:
              expandedEstimate === 'period',
          }}
          onPress={() =>
            setExpandedEstimate((current) =>
              current === 'period'
                ? null
                : 'period',
            )
          }
          style={({ pressed }) => [
            styles.estimateHeader,
            pressed && styles.estimatePressed,
          ]}>
          <Text style={styles.estimateIcon}>
            🩸
          </Text>

          <View style={styles.estimateText}>
            <Text style={styles.predictionEyebrow}>
              NEXT PERIOD ESTIMATE
            </Text>

            <Text style={styles.estimateSummary}>
              Around {predictedPeriodDate}
            </Text>
          </View>

          <Text style={styles.estimateToggle}>
            {expandedEstimate === 'period'
              ? '−'
              : '+'}
          </Text>
        </Pressable>

        {expandedEstimate === 'period' && (
          <View style={styles.estimateDetails}>
            <View style={styles.predictionWindow}>
              <Text
                style={
                  styles.predictionWindowLabel
                }>
                Likely window
              </Text>

              <Text
                style={
                  styles.predictionWindowValue
                }>
                {predictedWindowStart} –{' '}
                {predictedWindowEnd}
              </Text>
            </View>

            <Text style={styles.predictionNote}>
              Based on your recent cycle history.
              Your timing may shift as your cycle
              changes.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  predictionCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  estimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  estimateIcon: {
    fontSize: 24,
  },

  estimateText: {
    flex: 1,
    gap: 4,
  },

  estimateSummary: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  estimateToggle: {
    color: Colors.gold,
    fontSize: 26,
    fontWeight: '500',
  },

  estimateDetails: {
    gap: Spacing.md,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },

  estimatePressed: {
    opacity: 0.7,
  },

  predictionEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  predictionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  predictionWindow: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: Spacing.md,
    gap: 5,
  },

  predictionWindowLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  predictionWindowValue: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  predictionNote: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});