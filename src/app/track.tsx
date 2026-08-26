import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import CalendarDay from '@/components/CalendarDay';
import CalendarHeader from '@/components/CalendarHeader';
import CycleEstimatesCard from '@/components/CycleEstimatesCard';
import CycleHistoryCard from '@/components/CycleHistoryCard';
import QuickLogHub from '@/components/quickLog/QuickLogHub';
import SectionCard from '@/components/SectionCard';
import SelectedDayCard from '@/components/SelectedDayCard';

import { getCyclePhase } from '@/lib/cycle';
import {
  getCycleDayForDate,
  getCycleDayFromPeriodStart,
  getCycleLengthHistory,
  getLatestCycleLength,
  getLatestPeriodDuration,
  getMostRecentPeriodStart,
} from '@/lib/cycleTracking';

import {
  getEstimatedFertileWindow,
  getNextPeriodPrediction,
  getPredictionReadiness,
} from '@/lib/cyclePrediction';

import {
  deleteJournalEntry,
  loadJournalEntries,
  saveJournalEntry,
} from '@/lib/journal';

import {
  getCyclePatternInsight,
  getCycleTrendMessage,
} from '@/lib/cycleInsights';


import type { FlowLevel } from '@/lib/flow';

import type { DailyEntry } from '@/lib/dashboard';

import {
  getPeriodReminderStatus,
} from '@/lib/cycleReminder';

import {
  getPeriodReminderMessage,
} from '@/lib/cycleReminderMessages';

import {
  schedulePeriodReminder
} from '@/lib/notifications';

import {
  clearDailyQuickLogs,
  getLocalDateKey,
} from '@/lib/dailyQuickLog';

import {
  getAdvancedPatterns,
} from '@/lib/advancedPatterns';

import FlowScreen from '@/components/quickLog/FlowScreen';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import {
  useUserProfile,
} from '@/hooks/useUserProfile';

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

function formatSelectedDate(date: Date) {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
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


function getStoredCycleDay(
  cycleDay:
    | number
    | undefined,
): number | null {
  if (
    typeof cycleDay === 'number' &&
    cycleDay > 0
  ) {
    return cycleDay;
  }

  return null;
}

export default function TrackScreen() {

  const {
  profile,
} = useUserProfile();

const showsCycleTracking =
  profile.trackingPreference ===
  'cycle';

const showsPeriodLogging =
  showsCycleTracking ||
  profile.tracksPeriodGap;

  const today = useMemo(() => new Date(), []);

  const [visibleMonth, setVisibleMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

  const [editingPeriod, setEditingPeriod] =
    useState(false);

    const [editingDailyLog, setEditingDailyLog] =
  useState(false);

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [
    journalEntries,
    setJournalEntries,
  ] = useState<JournalEntry[]>([]);

  const lastPeriodStart =
    getMostRecentPeriodStart(
      journalEntries,
    );

  const trackedCycleDay =
    lastPeriodStart
      ? getCycleDayFromPeriodStart(
          lastPeriodStart,
          today,
        )
      : null;

  const latestPeriodDuration =
    getLatestPeriodDuration(
      journalEntries,
    );

  const latestCycleLength =
    getLatestCycleLength(
      journalEntries,
    );

  const cycleLengthHistory =
    getCycleLengthHistory(
      journalEntries,
    );

  const {
    recentCycleLengths,
    averageCycleLength,
    shortestCycle,
    longestCycle,
    cycleVariation,
    trend,
  } = getCyclePatternInsight(
    cycleLengthHistory,
  );

  const cycleTrendMessage =
    getCycleTrendMessage(trend);

    const nextPeriodPrediction =
  getNextPeriodPrediction(
    lastPeriodStart,
    cycleLengthHistory,
  );

  const fertileWindowPrediction =
  getEstimatedFertileWindow(
    nextPeriodPrediction,
  );

const predictionReadiness =
  getPredictionReadiness(
    lastPeriodStart,
    cycleLengthHistory,
  );

const periodReminderStatus =
  getPeriodReminderStatus({
   today,
    predictionReadiness,
    prediction:
      nextPeriodPrediction,
    hasStartedNewPeriodToday:
      journalEntries.some(
        (entry) =>
          entry.date ===
            createDateKey(today) &&
          entry.startsNewPeriod === true,
      ),
  });

  const periodReminderMessage =
  periodReminderStatus === 'remind'
    ? getPeriodReminderMessage(
        new Date().getDate(),
      )
    : null;

console.log(
  'Period reminder status:',
  periodReminderStatus,
);

function createReminderKey(): string | null {
  if (!nextPeriodPrediction) {
    return null;
  }

  const start =
    createDateKey(
      nextPeriodPrediction.windowStart,
    );

  const end =
    createDateKey(
      nextPeriodPrediction.windowEnd,
    );

  return `${start}_${end}`;
}

  const predictedPeriodDate =
  nextPeriodPrediction?.predictedDate.toLocaleDateString(
    'en-CA',
    {
      month: 'long',
      day: 'numeric',
    },
  );

const predictedWindowStart =
  nextPeriodPrediction?.windowStart.toLocaleDateString(
    'en-CA',
    {
      month: 'short',
      day: 'numeric',
    },
  );

const predictedWindowEnd =
  nextPeriodPrediction?.windowEnd.toLocaleDateString(
    'en-CA',
    {
      month: 'short',
      day: 'numeric',
    },
  );

  const estimatedOvulationDate =
  fertileWindowPrediction
    ?.estimatedOvulationDate
    .toLocaleDateString(
      'en-CA',
      {
        month: 'long',
        day: 'numeric',
      },
    );

const fertileWindowStart =
  fertileWindowPrediction
    ?.windowStart
    .toLocaleDateString(
      'en-CA',
      {
        month: 'short',
        day: 'numeric',
      },
    );

const fertileWindowEnd =
  fertileWindowPrediction
    ?.windowEnd
    .toLocaleDateString(
      'en-CA',
      {
        month: 'short',
        day: 'numeric',
      },
    );

  const calendarDays = useMemo(
    () =>
      createCalendarDays(
        visibleMonth,
      ),
    [visibleMonth],
  );

  useFocusEffect(
    useCallback(() => {
      async function loadEntries() {
        try {
          const savedEntries =
            await loadJournalEntries();

          setJournalEntries(
            savedEntries,
          );
        } catch (error) {
          console.error(
            'Unable to load journal entries:',
            error,
          );
        }
      }

      void loadEntries();
    }, []),
  );

const monthLabel =
  visibleMonth.toLocaleDateString(
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
  trackedCycleDay;

const todayPhase =
  todayCycleDay !== null
    ? getCyclePhase(todayCycleDay)
    : null;

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

  const selectedCycleDay =
  lastPeriodStart &&
  selectedDateKey >= lastPeriodStart
    ? getCycleDayFromPeriodStart(
        lastPeriodStart,
        selectedDate,
      )
    : null;

    const recentStoryEntries = useMemo(() => {
  const storyStartDate = new Date(today);

  storyStartDate.setDate(
    storyStartDate.getDate() - 29,
  );

  storyStartDate.setHours(
    0,
    0,
    0,
    0,
  );

  return journalEntries.filter(
    (entry) => {
      const entryDate = new Date(
        `${entry.date}T12:00:00`,
      );

      return (
        !Number.isNaN(
          entryDate.getTime(),
        ) &&
        entryDate >= storyStartDate &&
        entryDate <= today
      );
    },
  );
}, [
  journalEntries,
  today,
]);

const hormonalStory =
  getAdvancedPatterns(
    recentStoryEntries,
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

async function clearSelectedDateLogs() {
  const updatedEntries =
    await deleteJournalEntry(
      selectedDateKey,
    );

  if (
    selectedDateKey ===
    getLocalDateKey()
  ) {
    await clearDailyQuickLogs();
  }

  setJournalEntries(updatedEntries);
}

async function saveSelectedDateToJournal(
  updates: Partial<DailyEntry>,
) {
  const entryToSave: DailyEntry = {
    ...(selectedEntry ?? {}),
    date: selectedDateKey,
    cycleDay:
      selectedEntry?.cycleDay ??
      selectedCycleDay ??
      0,
    mood: selectedEntry?.mood ?? null,
    symptoms:
      selectedEntry?.symptoms ?? [],
    ...updates,
  };

  const updatedEntries =
    await saveJournalEntry(entryToSave);

  setJournalEntries(updatedEntries);
}

async function saveHistoricalPeriod(
  flow: FlowLevel,
  startsNewPeriod: boolean,
  endsPeriod: boolean,
) {
  const selectedCycleDay =
    getCycleDayForDate(
      journalEntries,
      selectedDate,
    );

  const updatedEntry: DailyEntry = {
    ...(selectedEntry ?? {}),
    date: selectedDateKey,
    cycleDay:
      selectedEntry?.cycleDay ??
      selectedCycleDay ??
      0,
    mood: selectedEntry?.mood ?? null,
    symptoms:
      selectedEntry?.symptoms ?? [],
    flow,
    startsNewPeriod,
    endsPeriod,
  };

  const updatedEntries =
    await saveJournalEntry(
      updatedEntry,
    );

  setJournalEntries(updatedEntries);
  setEditingPeriod(false);
}

async function scheduleRealPeriodReminder() {
 if (
  !showsCycleTracking ||
  periodReminderStatus !== 'remind' ||
  !periodReminderMessage
) {
  return;
}

  const reminderKey =
    createReminderKey();

  if (!reminderKey) {
    return;
  }

  const reminderDate =
  new Date(
    nextPeriodPrediction!.windowStart,
  );

reminderDate.setHours(
  9,
  0,
  0,
  0,
);

const now = new Date();

if (reminderDate <= now) {
  reminderDate.setTime(
    now.getTime() + 5000,
  );
}

  const notificationId =
   await schedulePeriodReminder(
  periodReminderMessage,
  reminderKey,
  reminderDate,
);

  console.log(
    'Period reminder scheduling result:',
    notificationId,
  );
}

useEffect(() => {
  void scheduleRealPeriodReminder();
}, [
  showsCycleTracking,
  periodReminderStatus,
  periodReminderMessage,
]);


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
       {showsCycleTracking
  ? todayPhase
    ? `${todayPhase.emoji} ${todayPhase.title}`
    : 'Cycle tracking not started'
  : 'Your wellness timeline'}
      </Text>

      <Text style={styles.todayCycleDay}>
   {showsCycleTracking
  ? todayCycleDay !== null
    ? `Cycle day ${todayCycleDay}`
    : 'Log the first day of your period to begin cycle tracking'
  : 'Mood, symptoms, sleep, supplements, and daily patterns'}
      </Text>

{showsCycleTracking &&
  (latestPeriodDuration !== null ||
    latestCycleLength !== null) && (
    <Text style={styles.periodDuration}>
      {latestPeriodDuration !== null
        ? `Last period: ${latestPeriodDuration} ${
            latestPeriodDuration === 1
              ? 'day'
              : 'days'
          }`
        : ''}

      {latestPeriodDuration !== null &&
      latestCycleLength !== null
        ? '  •  '
        : ''}

      {latestCycleLength !== null
        ? `Last cycle: ${latestCycleLength} days`
        : ''}
    </Text>
)}

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

const isPredictedPeriodWindow =
  showsCycleTracking &&
  predictionReadiness === 'ready' &&
  nextPeriodPrediction !== null &&
  date > today &&
  date >= nextPeriodPrediction.windowStart &&
  date <= nextPeriodPrediction.windowEnd;

const isPredictedPeriodDate =
  showsCycleTracking &&
  predictionReadiness === 'ready' &&
  nextPeriodPrediction !== null &&
  date > today &&
  createDateKey(date) ===
    createDateKey(
      nextPeriodPrediction.predictedDate,
    );

    const isEstimatedFertileWindow =
  showsCycleTracking &&
  predictionReadiness === 'ready' &&
  fertileWindowPrediction !== null &&
  date >=
    fertileWindowPrediction.windowStart &&
  date <=
    fertileWindowPrediction.windowEnd;

const isEstimatedOvulationDate =
  showsCycleTracking &&
  predictionReadiness === 'ready' &&
  fertileWindowPrediction !== null &&
  createDateKey(date) ===
    createDateKey(
      fertileWindowPrediction
        .estimatedOvulationDate,
    );

              const moodEmoji =
                entry?.mood?.split(' ')[0];

              const bodyLoad =
                entry?.symptoms?.length ?? 0;

              const periodStartDate =
  lastPeriodStart
    ? new Date(
        `${lastPeriodStart}T12:00:00`,
      )
    : null;

const isOnOrAfterPeriodStart =
  periodStartDate !== null &&
  date.getTime() >=
    periodStartDate.getTime();

const trackedDateCycleDay =
  lastPeriodStart &&
  isOnOrAfterPeriodStart
    ? getCycleDayFromPeriodStart(
        lastPeriodStart,
        date,
      )
    : null;

const cycleDay =
  trackedDateCycleDay;

const phase =
  showsCycleTracking &&
  cycleDay !== null
    ? getCyclePhase(cycleDay)
    : null;

const bodyLoadColor =
    getBodyLoadColor(bodyLoad);

    return (

<CalendarDay
  key={dateKey}
  day={date.getDate()}
  isToday={isToday}
  isSelected={isSelected}
  hasEntry={Boolean(entry)}
  phaseColor={phase?.color}
  moodEmoji={moodEmoji}
  bodyLoadColor={bodyLoadColor}
  flow={
  showsCycleTracking
    ? entry?.flow
    : undefined
}
startsNewPeriod={
  showsCycleTracking
    ? entry?.startsNewPeriod
    : undefined
}
endsPeriod={
  showsCycleTracking
    ? entry?.endsPeriod
    : undefined
}
  isPredictedPeriodWindow={
    isPredictedPeriodWindow
  }
  isPredictedPeriodDate={
    isPredictedPeriodDate
  }
  isEstimatedFertileWindow={
  isEstimatedFertileWindow
}
isEstimatedOvulationDate={
  isEstimatedOvulationDate
}
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

  {showsCycleTracking && (
    <>

<View style={styles.legendItem}>
  <View style={styles.ovulationLegendDot} />

  <Text style={styles.legendText}>
    Estimated ovulation
  </Text>
</View>

      <View style={styles.legendItem}>
        <View
          style={
            styles.predictedWindowLegend
          }
        />

        <Text style={styles.legendText}>
          Predicted window
        </Text>
      </View>

     <View style={styles.legendItem}>
  <View style={styles.predictedDateLegend} />

  <Text style={styles.legendText}>
    Estimated start
  </Text>
</View>
    </>
  )}
</View>
        </View>

  <SelectedDayCard
  formattedDate={
    formatSelectedDate(selectedDate)
  }
  entry={selectedEntry}
  cycleDay={selectedCycleDay}
  showCycleTracking={
    showsCycleTracking
  }
onEditPeriod={
  showsPeriodLogging
    ? () => setEditingPeriod(true)
    : undefined
}
onAddLog={() =>
  setEditingDailyLog(true)
}

onClearLog={
  selectedEntry
    ? () => {
        const hasPeriodData =
          Boolean(
            selectedEntry.flow &&
            selectedEntry.flow !== 'None',
          ) ||
          selectedEntry.startsNewPeriod ||
          selectedEntry.endsPeriod;

        Alert.alert(
          'Clear this day’s logs?',
          hasPeriodData
            ? `This will remove everything logged for ${formatSelectedDate(
                selectedDate,
              )}, including period information. Your cycle estimates may update. This cannot be undone.`
            : `This will remove everything logged for ${formatSelectedDate(
                selectedDate,
              )}. This cannot be undone.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Clear logs',
              style: 'destructive',
              onPress: () => {
                void clearSelectedDateLogs();
              },
            },
          ],
        );
      }
    : undefined
}

/>

<CycleEstimatesCard
  showsCycleTracking={
    showsCycleTracking
  }
  predictionReadiness={
    predictionReadiness
  }
  estimatedOvulationDate={
    estimatedOvulationDate
  }
  fertileWindowStart={
    fertileWindowStart
  }
  fertileWindowEnd={
    fertileWindowEnd
  }
  predictedPeriodDate={
    predictedPeriodDate
  }
  predictedWindowStart={
    predictedWindowStart
  }
  predictedWindowEnd={
    predictedWindowEnd
  }
/>

<CycleHistoryCard
  showsCycleTracking={
    showsCycleTracking
  }
  cycleLengthHistory={
    cycleLengthHistory
  }
  recentCycleLengths={
    recentCycleLengths
  }
  averageCycleLength={
    averageCycleLength
  }
  shortestCycle={
    shortestCycle
  }
  longestCycle={
    longestCycle
  }
  cycleVariation={
    cycleVariation
  }
  cycleTrendMessage={
    cycleTrendMessage
  }
/>

<SectionCard
  title="Your Hormonal Story"
  emoji="🧬"
  collapsible
  defaultExpanded={false}
  summary={
    !hormonalStory.hasEnoughData
      ? `${hormonalStory.loggedDays} of ${hormonalStory.minimumDays} days logged`
      : hormonalStory.patterns.length === 0
        ? 'No repeated patterns yet'
        : `${hormonalStory.patterns.length} ${
            hormonalStory.patterns.length === 1
              ? 'pattern'
              : 'patterns'
          } noticed`
  }>

  <Text style={styles.futureTitle}>
    What your recent logs are showing
  </Text>

  {!hormonalStory.hasEnoughData ? (
    <>
      <Text style={styles.futureText}>
        HMHC is still learning your rhythm.
        You&apos;ve logged{' '}
        {hormonalStory.loggedDays} of the{' '}
        {hormonalStory.minimumDays} days
        needed to begin spotting repeated
        patterns.
      </Text>

      <Text style={styles.storyNote}>
        Keep checking in when you can.
        You&apos;re building the picture one
        ordinary day at a time.
      </Text>
    </>
  ) : hormonalStory.patterns.length === 0 ? (
    <>
      <Text style={styles.futureText}>
        Nothing is repeating strongly enough
        yet to call it a pattern.
      </Text>

      <Text style={styles.storyNote}>
        That&apos;s still useful information.
        HMHC will keep watching without
        inventing connections that aren&apos;t
        there.
      </Text>
    </>
  ) : (
    <>
      {hormonalStory.patterns
        .slice(0, 2)
        .map((pattern) => (
          <View
            key={pattern.id}
            style={styles.storyPatternCard}>
            <Text style={styles.storyPatternEyebrow}>
              {pattern.eyebrow}
            </Text>

            <Text style={styles.storyPatternTitle}>
              {pattern.title}
            </Text>

            <Text style={styles.storyPatternMessage}>
              {pattern.message}
            </Text>

            <Text style={styles.storyEvidence}>
              {pattern.evidence}
            </Text>
          </View>
        ))}

      <Text style={styles.storyNote}>
        These are observations from your
        recent logs, not diagnoses. The story
        gets clearer as you keep logging.
      </Text>
    </>
  )}
</SectionCard>

 </ScrollView>

<Modal
  visible={editingDailyLog}
  transparent
  animationType="fade"
  onRequestClose={() =>
    setEditingDailyLog(false)
  }>
  <View style={styles.editModalBackdrop}>
    <ScrollView
      style={styles.editModalCard}
      contentContainerStyle={
        styles.editModalContent
      }
      showsVerticalScrollIndicator={false}>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <View>
          <Text
            style={{
              color: Colors.gold,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.5,
            }}>
            DAILY LOG
          </Text>

          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: '800',
              marginTop: 4,
            }}>
            {formatSelectedDate(selectedDate)}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            setEditingDailyLog(false)
          }
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 28,
            }}>
            ×
          </Text>
        </Pressable>
      </View>

      <QuickLogHub
        selectedMood={
          selectedEntry?.mood ?? null
        }
        selectedSymptoms={
          selectedEntry?.symptoms ?? []
        }
        selectedSupplements={
          selectedEntry?.supplements ?? []
        }
        selectedSleep={
          selectedEntry?.sleep ?? null
        }
             selectedFitness={
          selectedEntry?.fitness ?? null
        }
        selectedFlow={
          selectedEntry?.flow ?? null
        }
        startsNewPeriod={
          selectedEntry?.startsNewPeriod ??
          false
        }
        endsPeriod={
          selectedEntry?.endsPeriod ??
          false
        }
        showFlow={showsPeriodLogging}

        onMoodSelect={async (mood) => {
          await saveSelectedDateToJournal({
            mood,
          });
        }}

        onSymptomsSave={async (
          symptoms,
        ) => {
          await saveSelectedDateToJournal({
            symptoms,
          });
        }}

        onSupplementsSave={async (
          supplements,
        ) => {
          await saveSelectedDateToJournal({
            supplements,
          });
        }}

        onSleepSave={async (sleep) => {
          await saveSelectedDateToJournal({
            sleep,
          });
        }}

        onFitnessSave={async (fitness) => {
  await saveSelectedDateToJournal({
    fitness,
  });
}}

      onFlowSave={async (
  flow,
  startsNewPeriod,
  endsPeriod,
) => {
  await saveHistoricalPeriod(
    flow,
    startsNewPeriod,
    endsPeriod,
  );
}}
      />

    </ScrollView>
  </View>
</Modal>

<Modal
  visible={editingPeriod}
  transparent
  animationType="fade"
  onRequestClose={() =>
    setEditingPeriod(false)
  }>
  <View style={styles.editModalBackdrop}>
    <ScrollView
      style={styles.editModalCard}
      contentContainerStyle={
        styles.editModalContent
      }
      showsVerticalScrollIndicator={false}>
      <FlowScreen
        selectedFlow={
          selectedEntry?.flow ?? null
        }
        startsNewPeriod={
          selectedEntry?.startsNewPeriod ??
          false
        }
        endsPeriod={
          selectedEntry?.endsPeriod ??
          false
        }
        onSave={saveHistoricalPeriod}
      />
    </ScrollView>
  </View>
</Modal>

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
  gap: 6,
  paddingBottom: 0,
},

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

title: {
  color: Colors.text,
  fontSize: 26,
  fontWeight: '800',
  lineHeight: 31,
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
  paddingBottom: 6,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
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
  paddingTop: Spacing.sm,
  rowGap: 10,
},

 legendItem: {
  width: '50%',
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

  ovulationLegendDot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: Colors.accent,
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

  storyPatternCard: {
  backgroundColor: Colors.background,
  borderColor: Colors.border,
  borderRadius: 16,
  borderWidth: 1,
  gap: 6,
  padding: 16,
},

storyPatternEyebrow: {
  color: Colors.gold,
  fontSize: 10,
  fontWeight: '800',
  letterSpacing: 1.3,
},

storyPatternTitle: {
  color: '#F4F4F5',
  fontSize: 16,
  fontWeight: '800',
  lineHeight: 22,
},

storyPatternMessage: {
  color: Colors.textSecondary,
  fontSize: 14,
  lineHeight: 21,
},

storyEvidence: {
  color: Colors.gold,
  fontSize: 12,
  fontWeight: '700',
  marginTop: 4,
},

storyNote: {
  color: Colors.textSecondary,
  fontSize: 13,
  fontStyle: 'italic',
  lineHeight: 20,
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

periodDuration: {
  color: Colors.textSecondary,
  fontSize: 13,
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
  borderRadius: 14,
  paddingHorizontal: Spacing.md,
  paddingVertical: 11,
  gap: 4,
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
  fontSize: 13,
  fontStyle: 'italic',
  lineHeight: 19,
},


editModalBackdrop: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#00000088',
  padding: Spacing.lg,
},

editModalCard: {
  width: '100%',
  maxWidth: 620,
  maxHeight: "85%",
  backgroundColor: Colors.surface,
  borderRadius: 20,
},

predictedWindowLegend: {
  width: 12,
  height: 12,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: Colors.gold,
},

predictedDateLegend: {
  width: 8,
  height: 8,
  backgroundColor: Colors.danger,
  borderRadius: 6,
  borderTopLeftRadius: 1,
  transform: [
    { rotate: '45deg' },
  ],
},

editModalContent: {
  padding: Spacing.lg,
},

});