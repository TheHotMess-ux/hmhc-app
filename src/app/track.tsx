import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalendarDay from '@/components/CalendarDay';
import CalendarHeader from '@/components/CalendarHeader';
import SelectedDayCard from '@/components/SelectedDayCard';

import { getCyclePhase } from '@/lib/cycle';
import { loadJournalEntries } from '@/lib/journal';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type JournalEntries = Awaited<
  ReturnType<typeof loadJournalEntries>
>;

type JournalEntry = JournalEntries[number];

const WEEKDAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

const REFERENCE_CYCLE_DAY = 18;
const ESTIMATED_CYCLE_LENGTH = 28;

function createDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createCalendarDays(month: Date): Array<Date | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const emptyDaysBeforeMonth = firstDayOfMonth.getDay();
  const numberOfDays = lastDayOfMonth.getDate();

  const days: Array<Date | null> = [];

  for (
    let index = 0;
    index < emptyDaysBeforeMonth;
    index += 1
  ) {
    days.push(null);
  }

  for (let day = 1; day <= numberOfDays; day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function formatSelectedDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getEstimatedCycleDay(
  date: Date,
  referenceDate: Date,
  referenceCycleDay: number,
  cycleLength = ESTIMATED_CYCLE_LENGTH,
): number {
  const dateAtNoon = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );

  const referenceAtNoon = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const dayDifference = Math.round(
    (dateAtNoon.getTime() - referenceAtNoon.getTime()) /
      millisecondsPerDay,
  );

  return (
    ((referenceCycleDay - 1 + dayDifference) %
      cycleLength +
      cycleLength) %
      cycleLength
  ) + 1;
}

function getBodyLoadColor(
  symptomCount: number,
): string | undefined {
  if (symptomCount === 0) {
    return undefined;
  }

  if (symptomCount <= 1) {
    return '#66BB6A';
  }

  if (symptomCount <= 3) {
    return '#FBC02D';
  }

  if (symptomCount <= 5) {
    return '#FB8C00';
  }

  return '#E53935';
}

export default function TrackScreen() {
  const today = useMemo(() => new Date(), []);

  const referenceDate = useMemo(() => new Date(), []);

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const [journalEntries, setJournalEntries] =
    useState<JournalEntry[]>([]);

  useEffect(() => {
    async function loadEntries() {
      try {
        const savedEntries = await loadJournalEntries();

        setJournalEntries(savedEntries);
      } catch (error) {
        console.error(
          'Unable to load journal entries:',
          error,
        );
      }
    }

    loadEntries();
  }, []);

  const calendarDays = useMemo(
    () => createCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const monthLabel = visibleMonth.toLocaleDateString(
    'en-CA',
    {
      month: 'long',
      year: 'numeric',
    },
  );

  const todayKey = createDateKey(today);
  const selectedDateKey = createDateKey(selectedDate);

const todayEntry = journalEntries.find(
  (entry) => entry.date === todayKey,
);

const todayCycleDay =
  todayEntry?.cycleDay ??
  getEstimatedCycleDay(
    today,
    referenceDate,
    REFERENCE_CYCLE_DAY,
    ESTIMATED_CYCLE_LENGTH,
  );

const todayPhase = getCyclePhase(todayCycleDay);

const todayMood =
  todayEntry?.mood ?? 'Not logged';

const todayBodyLoad =
  todayEntry?.symptoms?.length ?? 0;

const todayStatus =
  todayEntry
    ? 'Logged today'
    : 'Ready to check in';

  const selectedEntry = journalEntries.find(
    (entry) => entry.date === selectedDateKey,
  );

  function showPreviousMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1,
        ),
    );
  }

  function showNextMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1,
        ),
    );
  }

  function selectDay(date: Date) {
    setSelectedDate(date);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MY RHYTHM</Text>

          <Text style={styles.title}>
            Understand Your Patterns
          </Text>

          <Text style={styles.subtitle}>
            Your hormones influence far more than your period.
            Every entry helps reveal the patterns your body has
            been trying to show you all along.
          </Text>
        </View>

        <View style={styles.todayCard}>
  <View style={styles.todayHeader}>
    <View>
      <Text style={styles.todayEyebrow}>TODAY</Text>

      <Text style={styles.todayPhase}>
        {todayPhase.emoji} {todayPhase.title}
      </Text>

      <Text style={styles.todayCycleDay}>
        Cycle day {todayCycleDay}
      </Text>
    </View>

    <View
      style={[
        styles.statusBadge,
        todayEntry && styles.statusBadgeLogged,
      ]}
    >
      <Text style={styles.statusText}>
        {todayStatus}
      </Text>
    </View>
  </View>

  <View style={styles.summaryGrid}>
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>Mood</Text>

      <Text style={styles.summaryValue}>
        {todayMood}
      </Text>
    </View>

    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>
        Body load
      </Text>

      <Text style={styles.summaryValue}>
        {todayBodyLoad === 0
          ? 'Nothing logged'
          : `${todayBodyLoad} ${
              todayBodyLoad === 1
                ? 'symptom'
                : 'symptoms'
            }`}
      </Text>
    </View>
  </View>

  <Text style={styles.todayMessage}>
    {todayEntry
      ? 'Your body left a few clues today. We’re listening.'
      : 'No pressure. Log what matters when you have the bandwidth.'}
  </Text>
</View>

        <View style={styles.calendarCard}>
          <CalendarHeader
            monthLabel={monthLabel}
            onPrevious={showPreviousMonth}
            onNext={showNextMonth}
          />

          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((weekday) => (
              <Text
                key={weekday}
                style={styles.weekdayLabel}>
                {weekday}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={styles.dayCell}
                  />
                );
              }

              const dateKey = createDateKey(date);
              const isToday = dateKey === todayKey;
              const isSelected =
                dateKey === selectedDateKey;

              const entry = journalEntries.find(
                (journalEntry) =>
                  journalEntry.date === dateKey,
              );

              const moodEmoji =
                entry?.mood?.split(' ')[0];

              const bodyLoad =
                entry?.symptoms?.length ?? 0;

              const estimatedCycleDay =
                getEstimatedCycleDay(
                  date,
                  referenceDate,
                  REFERENCE_CYCLE_DAY,
                  ESTIMATED_CYCLE_LENGTH,
                );

              const cycleDay =
                entry?.cycleDay ?? estimatedCycleDay;

              const phase = getCyclePhase(cycleDay);

              const bodyLoadColor =
                getBodyLoadColor(bodyLoad);

              return (
                <CalendarDay
                  key={dateKey}
                  day={date.getDate()}
                  isToday={isToday}
                  isSelected={isSelected}
                  hasEntry={Boolean(entry)}
                  phaseColor={phase.color}
                  moodEmoji={moodEmoji}
                  bodyLoadColor={bodyLoadColor}
                  onPress={() => selectDay(date)}
                />
              );
            })}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.loggedDot} />

              <Text style={styles.legendText}>
                Logged day
              </Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.bodyLoadDot} />

              <Text style={styles.legendText}>
                Body load
              </Text>
            </View>
          </View>
        </View>

        <SelectedDayCard
          formattedDate={formatSelectedDate(selectedDate)}
          entry={selectedEntry}
        />

        <View style={styles.futureCard}>
          <Text style={styles.futureEyebrow}>
            COMING TO MY RHYTHM
          </Text>

          <Text style={styles.futureTitle}>
            Your full hormonal story
          </Text>

          <Text style={styles.futureText}>
            Period tracking, predicted phases, sleep,
            supplements and journal notes will eventually
            connect here to help uncover your patterns without
            turning wellness into another job.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 140,
    gap: Spacing.lg,
  },

  header: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },

  calendarCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  weekdayRow: {
    flexDirection: 'row',
  },

  weekdayLabel: {
    width: `${100 / 7}%`,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
  },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    paddingTop: Spacing.xs,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  loggedDot: {
    width: 7,
    height: 7,
    backgroundColor: Colors.cream,
    borderRadius: 4,
  },

  bodyLoadDot: {
    width: 7,
    height: 7,
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },

  legendText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },

  futureCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  futureEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  futureTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  futureText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

todayCard: {
  backgroundColor: Colors.surface,
  borderColor: Colors.border,
  borderRadius: 22,
  borderWidth: 1,
  padding: Spacing.lg,
  gap: Spacing.md,
},

todayHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: Spacing.md,
},

todayEyebrow: {
  color: Colors.gold,
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 1.5,
},

todayPhase: {
  color: Colors.text,
  fontSize: 20,
  fontWeight: '800',
  marginTop: 6,
},

todayCycleDay: {
  color: Colors.textSecondary,
  fontSize: 14,
  marginTop: 4,
},

statusBadge: {
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderRadius: 999,
  borderWidth: 1,
  paddingHorizontal: 12,
  paddingVertical: 7,
},

statusBadgeLogged: {
  borderColor: Colors.gold,
},

statusText: {
  color: Colors.textSecondary,
  fontSize: 11,
  fontWeight: '700',
},

summaryGrid: {
  flexDirection: 'row',
  gap: Spacing.md,
},

summaryItem: {
  flex: 1,
  backgroundColor: Colors.surfaceLight,
  borderRadius: 16,
  padding: Spacing.md,
  gap: 6,
},

summaryLabel: {
  color: Colors.textSecondary,
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
},

summaryValue: {
  color: Colors.text,
  fontSize: 15,
  fontWeight: '700',
  lineHeight: 21,
},

todayMessage: {
  color: Colors.textSecondary,
  fontSize: 14,
  lineHeight: 21,
},

});