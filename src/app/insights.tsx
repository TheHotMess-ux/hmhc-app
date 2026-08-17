import {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from 'expo-router';

import type {
  DailyEntry,
} from '@/lib/dashboard';

import {
  getDoctorReportSummary,
} from '@/lib/doctorReport';

import type {
  ReportCount,
} from '@/lib/doctorReport';

import {
  loadJournalEntries,
} from '@/lib/journal';

import {
  buildDoctorReportHtml,
} from '@/lib/doctorReportPdf';

import {
  getAdvancedPatterns,
} from '@/lib/advancedPatterns';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import PremiumGate from '@/components/premium/PremiumGate';

import AdvancedPatternsCard from '@/components/insights/AdvancedPatternsCard';

import {
  useUserProfile,
} from '@/hooks/useUserProfile';

const reportRanges = [
  7,
  30,
  90,
] as const;

type ReportRange =
  (typeof reportRanges)[number];

  type InsightsView =
  | 'patterns'
  | 'report';

type CountListProps = {
  items: ReportCount[];
  emptyMessage: string;
};

function CountList({
  items,
  emptyMessage,
}: CountListProps) {
  if (items.length === 0) {
    return (
      <Text style={styles.emptyText}>
        {emptyMessage}
      </Text>
    );
  }

  return (
    <View style={styles.countList}>
      {items.map((item) => (
        <View
          key={item.label}
          style={styles.countRow}>
          <Text style={styles.countLabel}>
            {item.label}
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {item.count}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function formatDate(
  dateValue: string | null,
): string {
  if (!dateValue) {
    return 'No entries yet';
  }

  const date = new Date(
    `${dateValue}T00:00:00`,
  );

  return date.toLocaleDateString(
    'en-CA',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
}

export default function InsightsScreen() {
  const [journalEntries, setJournalEntries] =
    useState<DailyEntry[]>([]);

  const [selectedRange, setSelectedRange] =
    useState<ReportRange>(30);

  const [activeView, setActiveView] =
  useState<InsightsView>('patterns');  

  const [isLoading, setIsLoading] =
    useState(true);

    const {
  profile,
} = useUserProfile();

  const [
    isGeneratingReport,
    setIsGeneratingReport,
    ] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function loadReportData() {
        setIsLoading(true);

        const savedEntries =
          await loadJournalEntries();

        if (screenIsActive) {
          setJournalEntries(
            savedEntries,
          );

          setIsLoading(false);
        }
      }

      void loadReportData();

      return () => {
        screenIsActive = false;
      };
    }, []),
  );

  const report =
    getDoctorReportSummary(
      journalEntries,
      selectedRange,
    );

  const rangeStartDate = new Date();

rangeStartDate.setHours(
  0,
  0,
  0,
  0,
);

rangeStartDate.setDate(
  rangeStartDate.getDate() -
    (selectedRange - 1),
);

const rangeEndDate = new Date();

rangeEndDate.setHours(
  23,
  59,
  59,
  999,
);

const entriesInSelectedRange =
  journalEntries.filter((entry) => {
    const entryDate = new Date(
      `${entry.date}T12:00:00`,
    );

    return (
      !Number.isNaN(entryDate.getTime()) &&
      entryDate >= rangeStartDate &&
      entryDate <= rangeEndDate
    );
  });

const advancedPatterns =
  getAdvancedPatterns(
    entriesInSelectedRange,
  );

  async function generateAndShareReport() {
  if (report.loggedDays === 0) {
    Alert.alert(
      'Not enough information yet',
      'Complete at least one Quick Log before generating a report.',
    );

    return;
  }

  try {
    setIsGeneratingReport(true);

   const Print =
    await import('expo-print');

    const Sharing =
      await import('expo-sharing'); 

    const html =
  buildDoctorReportHtml(
    report,
    profile,
  );

    const { uri } =
      await Print.printToFileAsync({
        html,
      });

    const sharingIsAvailable =
      await Sharing.isAvailableAsync();

    if (!sharingIsAvailable) {
      Alert.alert(
        'Sharing unavailable',
        'This device cannot share the PDF right now.',
      );

      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle:
        'Share HMHC Doctor Report',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error(
      'Unable to generate Doctor Report:',
      error,
    );

    Alert.alert(
      'Report generation failed',
      'The PDF could not be created. Please try again.',
    );
  } finally {
    setIsGeneratingReport(false);
  }
}

  return (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={
      styles.content
    }>
    <View style={styles.header}>

  <Text style={styles.eyebrow}>
    YOUR PATTERNS
  </Text>

  <Text style={styles.title}>
    Insights
  </Text>

  <Text style={styles.description}>
    See what your logs are revealing, or
    create a doctor-ready report when you
    need one.
  </Text>
</View>

<View style={styles.viewSelector}>
  <Pressable
    accessibilityRole="button"
    accessibilityState={{
      selected: activeView === 'patterns',
    }}
    accessibilityLabel="View Advanced Patterns"
    onPress={() =>
      setActiveView('patterns')
    }
    style={({ pressed }) => [
      styles.viewSelectorButton,
      activeView === 'patterns' &&
        styles.viewSelectorButtonSelected,
      pressed && styles.buttonPressed,
    ]}>
    <Text
      style={[
        styles.viewSelectorText,
        activeView === 'patterns' &&
          styles.viewSelectorTextSelected,
      ]}>
      Advanced Patterns
    </Text>
  </Pressable>

  <Pressable
    accessibilityRole="button"
    accessibilityState={{
      selected: activeView === 'report',
    }}
    accessibilityLabel="View Doctor's Report"
    onPress={() =>
      setActiveView('report')
    }
    style={({ pressed }) => [
      styles.viewSelectorButton,
      activeView === 'report' &&
        styles.viewSelectorButtonSelected,
      pressed && styles.buttonPressed,
    ]}>
    <Text
      style={[
        styles.viewSelectorText,
        activeView === 'report' &&
          styles.viewSelectorTextSelected,
      ]}>
      Doctor&apos;s Report
    </Text>
  </Pressable>
</View>

    <View style={styles.rangeCard}>
        <Text style={styles.rangeLabel}>
          Time range
        </Text>

        <View style={styles.rangeOptions}>
          {reportRanges.map((range) => {
            const isSelected =
              selectedRange === range;

            return (
              <Pressable
                key={range}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                }}
                accessibilityLabel={
                  `Show the last ${range} days`
                }
                onPress={() =>
                  setSelectedRange(range)
                }
                style={({ pressed }) => [
                  styles.rangeButton,
                  isSelected &&
                    styles.rangeButtonSelected,
                  pressed &&
                    styles.buttonPressed,
                ]}>
                <Text
                  style={[
                    styles.rangeButtonText,
                    isSelected &&
                      styles.rangeButtonTextSelected,
                  ]}>
                  {range} days
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

{activeView === 'report' && (
<PremiumGate
  feature="doctorReport"
  title="Turn your logs into a doctor-ready report"
  description="See patterns across symptoms, mood, sleep, supplements, and bleeding—without having to remember everything yourself.">

      {isLoading ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>
            Gathering the evidence…
          </Text>

          <Text style={styles.emptyText}>
            Your hormones have submitted
            several documents for review.
          </Text>
        </View>
      ) : report.loggedDays === 0 ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageEmoji}>
            📝
          </Text>

          <Text style={styles.messageTitle}>
            No report data yet
          </Text>

          <Text style={styles.emptyText}>
            Complete your Quick Logs and your
            patterns will begin appearing here.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.dateCard}>
            <Text style={styles.cardEyebrow}>
              LOGGED DATE RANGE
            </Text>

            <Text style={styles.dateText}>
              {formatDate(
                report.firstLoggedDate,
              )}
              {' – '}
              {formatDate(
                report.lastLoggedDate,
              )}
            </Text>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {report.loggedDays}
              </Text>

              <Text style={styles.statLabel}>
                Logged days
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {report.bleedingDays}
              </Text>

              <Text style={styles.statLabel}>
                Bleeding days
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {report.sleep.loggedNights}
              </Text>

              <Text style={styles.statLabel}>
                Sleep logs
              </Text>
            </View>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.cardEmoji}>
              🔥
            </Text>

            <Text style={styles.cardTitle}>
              Most Logged Symptoms
            </Text>

            <Text style={styles.cardDescription}>
              Symptoms appearing most often
              during this reporting period.
            </Text>

            <CountList
              items={report.topSymptoms}
              emptyMessage="No symptoms were logged in this period."
            />
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.cardEmoji}>
              🌦️
            </Text>

            <Text style={styles.cardTitle}>
              Mood Patterns
            </Text>

            <Text style={styles.cardDescription}>
              Your logged emotional weather,
              without judgment or forced
              positivity.
            </Text>

            <CountList
              items={report.moods}
              emptyMessage="No moods were logged in this period."
            />
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.cardEmoji}>
              😴
            </Text>

            <Text style={styles.cardTitle}>
              Sleep Patterns
            </Text>

            <Text style={styles.subsectionTitle}>
              Sleep quality
            </Text>

            <CountList
              items={
                report.sleep.qualities
              }
              emptyMessage="No sleep quality data was logged."
            />

            <Text style={styles.subsectionTitle}>
              Sleep duration
            </Text>

            <CountList
              items={
                report.sleep.durations
              }
              emptyMessage="No sleep duration data was logged."
            />

            <View style={styles.detailGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailNumber}>
                  {
                    report.sleep
                      .frequentWakingNights
                  }
                </Text>

                <Text style={styles.detailLabel}>
                  Nights with frequent waking
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailNumber}>
                  {
                    report.sleep
                      .nightSweatNights
                  }
                </Text>

                <Text style={styles.detailLabel}>
                  Nights with night sweats
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.cardEmoji}>
              🩸
            </Text>

            <Text style={styles.cardTitle}>
              Cycle & Bleeding
            </Text>

            <View style={styles.detailGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailNumber}>
                  {report.periodStarts}
                </Text>

                <Text style={styles.detailLabel}>
                  Period starts
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailNumber}>
                  {report.bleedingDays}
                </Text>

                <Text style={styles.detailLabel}>
                  Bleeding days
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailNumber}>
                  {report.spottingDays}
                </Text>

                <Text style={styles.detailLabel}>
                  Spotting days
                </Text>
              </View>
            </View>

            <Text style={styles.subsectionTitle}>
              Logged flow
            </Text>

            <CountList
              items={report.flowLevels}
              emptyMessage="No Flow information was logged."
            />
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.cardEmoji}>
              💊
            </Text>

            <Text style={styles.cardTitle}>
              Supplements Logged
            </Text>

            <Text style={styles.cardDescription}>
              Supplements recorded during this
              reporting period.
            </Text>

            <CountList
              items={report.supplements}
              emptyMessage="No supplements were logged in this period."
            />
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>
              A note before your appointment
            </Text>

            <Text style={styles.disclaimerText}>
              This report summarizes information
              you entered into the app. It does
              not provide a diagnosis or replace
              advice from a qualified healthcare
              professional.
            </Text>
          </View>

        <Pressable
  accessibilityRole="button"
  accessibilityLabel="Generate and share Doctor's Report PDF"
  disabled={isGeneratingReport}
  onPress={() => {
    void generateAndShareReport();
  }}
  style={({ pressed }) => [
    styles.shareButton,
    isGeneratingReport &&
      styles.shareButtonDisabled,
    pressed &&
      !isGeneratingReport &&
      styles.buttonPressed,
  ]}>
  <Text style={styles.shareButtonIcon}>
    📄
  </Text>

  <View style={styles.shareButtonTextGroup}>
    <Text style={styles.shareButtonTitle}>
      {isGeneratingReport
        ? 'Preparing your report…'
        : 'Generate & Share PDF'}
    </Text>

    <Text style={styles.shareButtonDescription}>
      Create an appointment-ready copy
      using the selected reporting period.
    </Text>
  </View>
</Pressable>
        </>
      )}
    </PremiumGate>
)}

  {activeView === 'patterns' && (
  <AdvancedPatternsCard
    summary={advancedPatterns}
    rangeDays={selectedRange}
  />
)}

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
    paddingBottom: 110,
    gap: Spacing.lg,
  },

  header: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: '800',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },

  rangeCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  rangeLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  rangeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  rangeButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },

  rangeButtonSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  rangeButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },

  rangeButtonTextSelected: {
    color: Colors.background,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  messageCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },

  messageEmoji: {
    fontSize: 34,
  },

  messageTitle: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  dateCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.md,
    gap: 6,
  },

  cardEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  dateText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  statGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 5,
  },

  statNumber: {
    color: Colors.gold,
    fontSize: 25,
    fontWeight: '900',
  },

  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },

  reportCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  cardEmoji: {
    fontSize: 28,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: '800',
  },

  cardDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  subsectionTitle: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },

  countList: {
    gap: Spacing.sm,
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  countLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  countBadgeText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  detailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 14,
    padding: Spacing.md,
    gap: 5,
  },

  detailNumber: {
    color: Colors.gold,
    fontSize: 23,
    fontWeight: '900',
  },

  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  disclaimerCard: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  disclaimerTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  disclaimerText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  shareButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.gold,
  borderRadius: 18,
  padding: Spacing.lg,
  gap: Spacing.md,
},

shareButtonDisabled: {
  opacity: 0.6,
},

shareButtonIcon: {
  fontSize: 28,
},

shareButtonTextGroup: {
  flex: 1,
  gap: 4,
},

shareButtonTitle: {
  color: Colors.background,
  fontSize: 17,
  fontWeight: '900',
},

shareButtonDescription: {
  color: Colors.background,
  fontSize: 12,
  lineHeight: 17,
  opacity: 0.8,
},

viewSelector: {
  flexDirection: 'row',
  backgroundColor: Colors.surface,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 16,
  padding: 4,
  gap: 4,
},

viewSelectorButton: {
  flex: 1,
  minHeight: 48,
  borderRadius: 12,
  paddingHorizontal: Spacing.sm,
  paddingVertical: Spacing.sm,
  alignItems: 'center',
  justifyContent: 'center',
},

viewSelectorButtonSelected: {
  backgroundColor: Colors.gold,
},

viewSelectorText: {
  color: Colors.textSecondary,
  fontSize: 14,
  fontWeight: '700',
  textAlign: 'center',
},

viewSelectorTextSelected: {
  color: Colors.background,
},

});