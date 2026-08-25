
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCallback,
  useState
} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import QuickLogHub from '@/components/quickLog/QuickLogHub';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import FeralForecastCard from '../components/home/FeralForecastCard';
import HormoneBriefingCard from '../components/home/HormoneBriefingCard';
import MissionCard from '../components/home/MissionCard';
import PersonalizedInsightCard from '../components/home/PersonalizedInsightCard';

import {
  getCyclePhase as getDashboardCyclePhase,
  getSymptomInsight
} from '../lib/dashboard';

import { saveJournalEntry } from '../lib/journal';

import { getFeralForecast as getFeralLevel } from '@/lib/chaosLevel';

import { getCyclePhase as getCyclePhaseData } from '@/lib/cycle';
import { getFeralForecast } from '../lib/forecast';

import { getGreeting as getSmartGreeting } from '@/lib/greetings';

import MorningBriefingCard from "@/components/home/MorningBriefingCard";

import { useHomeDashboard } from '@/hooks/useHomeDashboard';

import type { DailyEntry } from '../lib/dashboard';

import MoreForYouCard from '@/components/home/MoreForYouCard';

import DailyWinsCard from '@/components/home/DailyWinsCard';
import { getDailyWins } from '@/lib/wins';

import CycleSetupCard from '@/components/home/CycleSetupCard';

import {
  getCycleDayFromPeriodStart,
  getMostRecentPeriodStart,
} from '@/lib/cycleTracking';

import {
  getCheckInStreak,
} from '@/lib/companion/memory';

import {
  getLocalDateKey,
  prepareDailyQuickLogs,
} from '@/lib/dailyQuickLog';

import {
  useUserProfile,
} from '@/hooks/useUserProfile';

import {
  useFocusEffect,
} from '@react-navigation/native';

const moodOptions = [
  { emoji: '🔥', label: 'Feral' },
  { emoji: '✨', label: 'Thriving' },
  { emoji: '🙂', label: 'Doing okay' },
  { emoji: '😩', label: 'Running on fumes' },
  { emoji: '🌪️', label: 'Emotionally weathered' },
];
const symptomOptions = [
  { emoji: '🔥', label: 'Hot flashes' },
  { emoji: '🧠', label: 'Brain fog' },
  { emoji: '😴', label: 'Fatigue' },
  { emoji: '💢', label: 'Rage' },
  { emoji: '🥵', label: 'Night sweats' },
  { emoji: '🫨', label: 'Anxiety' },
  { emoji: '🩸', label: 'Spotting' },
  { emoji: '🍫', label: 'Cravings' },
  { emoji: '🤕', label: 'Headache' },
  { emoji: '🦴', label: 'Joint pain' },
  { emoji: '🫧', label: 'Bloating' },
  { emoji: '😵‍💫', label: 'Dizziness' },
];

export default function HomeScreen() {
const dashboard = useHomeDashboard();

const {
  profile,
} = useUserProfile();

const {
  selectedMood,
  setSelectedMood,
} = dashboard;

const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);

const [isSymptomsModalVisible, setIsSymptomsModalVisible] = useState(false);

const {
  selectedSymptoms,
  setSelectedSymptoms,
} = dashboard;

const [isFlowModalVisible, setIsFlowModalVisible] =
  useState(false);

const {
  selectedFlow,
  setSelectedFlow,
  startsNewPeriod,
  setStartsNewPeriod,
  endsPeriod,
  setEndsPeriod,
} = dashboard;

const {
  selectedSleep,
  setSelectedSleep,
} = dashboard;

const {
  journalEntries,
  setJournalEntries,
} = dashboard;

const checkInStreak =
  getCheckInStreak(journalEntries);

  const yesterday = new Date();

yesterday.setDate(
  yesterday.getDate() - 1,
);

const yesterdayKey = [
  yesterday.getFullYear(),
  String(
    yesterday.getMonth() + 1,
  ).padStart(2, '0'),
  String(
    yesterday.getDate(),
  ).padStart(2, '0'),
].join('-');

const yesterdayEntry =
  journalEntries.find(
    (entry) =>
      entry.date === yesterdayKey,
  );

const toggleSymptom = (label: string) => {
  setSelectedSymptoms((currentSymptoms) => {
    if (currentSymptoms.includes(label)) {
      return currentSymptoms.filter(
        (symptom) => symptom !== label,
      );
    }

    return [...currentSymptoms, label];
  });
};
  const lastPeriodStart =
  getMostRecentPeriodStart(journalEntries);

const trackedCycleDay =
  lastPeriodStart
    ? getCycleDayFromPeriodStart(
        lastPeriodStart,
      )
    : null;

const cycleDayForCalculations =
  trackedCycleDay ?? 1;

const forecast =
  getFeralForecast(
    cycleDayForCalculations,
  );

  const today =
  getLocalDateKey();

const dailyEntry = {
  date: today,
  cycleDay:
  trackedCycleDay ?? 0,
  mood: selectedMood,
  symptoms: selectedSymptoms,
};
const saveTodayToJournal = async (
  updates?: Partial<DailyEntry>,
) => {
  const entryToSave: DailyEntry = {
    ...dailyEntry,
    ...updates,
  };

  const updatedEntries =
    await saveJournalEntry(entryToSave);

  setJournalEntries(updatedEntries);

  console.log('Journal entry saved:', entryToSave);
};

const phaseInsight =
  getDashboardCyclePhase(
    cycleDayForCalculations,
  );

const cyclePhase =
  getCyclePhaseData(
    cycleDayForCalculations,
  );

const feralLevel = getFeralLevel({
  mood: selectedMood,
  symptoms: selectedSymptoms,
  flow: selectedFlow,
  cyclePhase: phaseInsight.phase,
});

const symptomInsight =
  trackedCycleDay !== null
    ? getSymptomInsight(
        phaseInsight.phase,
        selectedSymptoms,
      )
    : null;

const [
  selectedSupplements,
  setSelectedSupplements,
] = useState<string[]>([]);
useFocusEffect(
  useCallback(() => {
    async function loadSupplements() {
      await prepareDailyQuickLogs();

      const savedSupplements =
        await AsyncStorage.getItem(
          'todaysSupplements',
        );

      if (!savedSupplements) {
        setSelectedSupplements([]);
        return;
      }

      try {
        const parsedSupplements =
          JSON.parse(
            savedSupplements,
          ) as string[];

        setSelectedSupplements(
          parsedSupplements,
        );
      } catch (error) {
        console.error(
          'Unable to load supplements:',
          error,
        );

        setSelectedSupplements([]);
      }
    }

    void loadSupplements();
  }, []),
);

const greeting = getSmartGreeting();

const preferredName =
  profile.preferredName.trim();

const personalizedGreetingTitle =
  preferredName
    ? `${greeting.title.replace(
        /[.!?]+$/,
        '',
      )}, ${preferredName}!`
    : greeting.title;

    const showsCycleTracking =
  profile.trackingPreference ===
  'cycle';

  const showsPeriodLogging =
  showsCycleTracking ||
  profile.tracksPeriodGap;

const dailyWins = getDailyWins().map((win) => {
  let completed = false;

  if (win.id === 'mood') {
    completed = selectedMood !== null;
  }

  if (win.id === 'symptoms') {
    completed = selectedSymptoms.length > 0;
  }

  if (win.id === 'flow') {
    completed = selectedFlow !== null;
  }

  return {
    ...win,
    completed,
  };
});

const moreForYouItems = [
  ...(symptomInsight
    ? [
        {
          id: 'insight',
          emoji: '🧠',
          title: 'Personalized Insight',
          summary:
            "We've noticed something interesting...",
          content: (
            <PersonalizedInsightCard
              title={symptomInsight.title}
              message={symptomInsight.message}
              supportTips={
                symptomInsight.supportTips
              }
            />
          ),
        },
      ]
    : []),

{
  id: 'wins',
  emoji: '🌼',
  title: 'Little Victories',
  summary:
    'A little proof that you showed up today.',
  content: (
    <DailyWinsCard wins={dailyWins} />
  ),
},
];

return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          THE HOT MESS HORMONE CLUB
        </Text>

   <Text style={styles.greeting}>
  {greeting.emoji}{' '}
  {personalizedGreetingTitle}
</Text>

<Text style={styles.subtitle}>
  {greeting.subtitle}
</Text>
      </View>

{showsCycleTracking && (
  <>
{trackedCycleDay !== null ? (
  <>
    <MorningBriefingCard
      name={profile.preferredName}
      phase={cyclePhase.phase}
      cycleDay={trackedCycleDay}
      mood={selectedMood}
      symptoms={selectedSymptoms}
      checkInStreak={checkInStreak}
      yesterdayMood={
        yesterdayEntry?.mood ?? null
      }
      yesterdaySymptoms={
        yesterdayEntry?.symptoms ?? []
      }
      yesterdayFlow={
        yesterdayEntry?.flow ?? null
      }
    />

    <FeralForecastCard
      coffeeForecast={
        forecast.coffeeForecast
      }
      brainFogForecast={
        forecast.brainFogForecast
      }
      patienceForecast={
        forecast.patienceForecast
      }
      survivalStrategy={
        forecast.survivalStrategy
      }
      feralLevel={feralLevel}
    />

    <HormoneBriefingCard
      title="Hormone Briefing"
      phase={`${cyclePhase.emoji} ${cyclePhase.title}`}
      description={
        cyclePhase.description
      }
      encouragement={
        cyclePhase.encouragement
      }
    />

    <MissionCard
      mission={phaseInsight.mission}
    />
  </>
) : (
  <CycleSetupCard />
)}
</>
)}

<QuickLogHub
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
  selectedSupplements={
  selectedSupplements}
  selectedSleep={selectedSleep}
  selectedFlow={selectedFlow}
  showFlow={showsPeriodLogging}
  startsNewPeriod={startsNewPeriod}
  endsPeriod={endsPeriod}
  onMoodSelect={async (value) => {
    setSelectedMood(value);

    await AsyncStorage.setItem(
      'todaysMood',
      value,
    );

    await saveTodayToJournal({
      mood: value,
    });
  }}
  onSymptomsSave={async (symptoms) => {
    setSelectedSymptoms(symptoms);

    await AsyncStorage.setItem(
      'todaysSymptoms',
      JSON.stringify(symptoms),
    );

    await saveTodayToJournal({
      symptoms,
    });
  }}

  onSupplementsSave={async (
  supplements,
) => {
  setSelectedSupplements(
    supplements,
  );

  await AsyncStorage.setItem(
    'todaysSupplements',
    JSON.stringify(
      supplements,
    ),
  );

  await saveTodayToJournal({
    supplements,
  });
}}
  
onFlowSave={async (
  flow,
  startsNewPeriodValue,
  endsPeriodValue,
) => {
  setSelectedFlow(flow);
  setStartsNewPeriod(startsNewPeriodValue);
  setEndsPeriod(endsPeriodValue);

  await AsyncStorage.setItem(
    'todaysFlow',
    flow,
  );

  await AsyncStorage.setItem(
    'startsNewPeriod',
    JSON.stringify(
      startsNewPeriodValue,
    ),
  );

  await AsyncStorage.setItem(
    'endsPeriod',
    JSON.stringify(
      endsPeriodValue,
    ),
  );

  await saveTodayToJournal({
    flow,
    startsNewPeriod:
      startsNewPeriodValue,
    endsPeriod:
      endsPeriodValue,
  });
}}

onSleepSave={async (sleep) => {
  setSelectedSleep(sleep);

  await AsyncStorage.setItem(
    'todaysSleep',
    JSON.stringify(sleep),
  );

  await saveTodayToJournal({
    sleep,
  });
}}
/>

<MoreForYouCard
  items={moreForYouItems}
/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
 quickLogButtonSelected: {
  borderColor: Colors.gold,
  borderWidth: 2,
  backgroundColor: Colors.surfaceLight,
}, 
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 48,
  },
  header: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  greeting: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  bodyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  phaseLabel: {
  color: Colors.cream,
  fontSize: 17,
  fontWeight: '700',
},
  pepTalk: {
    color: Colors.cream,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
    },
    quickLogGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: Spacing.md,
},

quickLogButton: {
  width: '47%',
  minHeight: 120,
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 16,
  padding: Spacing.md,
  justifyContent: 'center',
  alignItems: 'center',
  gap: Spacing.xs,
},

buttonPressed: {
  opacity: 0.7,
  transform: [{ scale: 0.98 }],
},

quickLogEmoji: {
  fontSize: 28,
},

quickLogLabel: {
  color: Colors.cream,
  fontSize: 16,
  fontWeight: '700',
},

quickLogValue: {
  color: Colors.gold,
  fontSize: 12,
  textAlign: 'center',
},

comingSoon: {
  color: Colors.textSecondary,
  fontSize: 11,
},

modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.78)',
  justifyContent: 'center',
  padding: Spacing.lg,
},

modalCard: {
  width: '100%',
  maxWidth: 520,
  alignSelf: 'center',
  backgroundColor: Colors.surface,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 24,
  padding: Spacing.lg,
  gap: Spacing.lg,
},

modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: Spacing.md,
},

modalEyebrow: {
  color: Colors.gold,
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 2,
  marginBottom: Spacing.xs,
},

modalTitle: {
  color: Colors.text,
  fontSize: 25,
  fontWeight: '700',
},

modalDescription: {
  color: Colors.textSecondary,
  fontSize: 15,
  lineHeight: 22,
},

closeButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: Colors.surfaceLight,
  justifyContent: 'center',
  alignItems: 'center',
},

closeButtonText: {
  color: Colors.cream,
  fontSize: 28,
  lineHeight: 30,
},

moodList: {
  gap: Spacing.sm,
},

moodOption: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 14,
  padding: Spacing.md,
  gap: Spacing.md,
},

moodEmoji: {
  fontSize: 25,
},

moodLabel: {
  color: Colors.cream,
  fontSize: 17,
  fontWeight: '600',
},

clearMood: {
  color: Colors.textSecondary,
  fontSize: 14,
  textAlign: 'center',
  textDecorationLine: 'underline',
  },
  symptomScroll: {
  maxHeight: 380,
},

symptomGrid: {
  gap: Spacing.sm,
},

symptomOption: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 14,
  padding: Spacing.md,
  gap: Spacing.md,
},

symptomOptionSelected: {
  borderColor: Colors.gold,
  borderWidth: 2,
},

symptomEmoji: {
  fontSize: 24,
},

symptomLabel: {
  flex: 1,
  color: Colors.cream,
  fontSize: 16,
  fontWeight: '600',
},

symptomLabelSelected: {
  color: Colors.gold,
},

symptomCheck: {
  color: Colors.gold,
  fontSize: 18,
  fontWeight: '700',
},

saveButton: {
  backgroundColor: Colors.gold,
  borderRadius: 14,
  padding: Spacing.md,
  alignItems: 'center',
},

saveButtonText: {
  color: Colors.background,
  fontSize: 16,
  fontWeight: '800',
},

timelineButton: {
  marginTop: Spacing.md,
  borderWidth: 1,
  borderColor: Colors.gold,
  borderRadius: 14,
  padding: Spacing.md,
  alignItems: 'center',
},

timelineButtonText: {
  color: Colors.gold,
  fontSize: 15,
  fontWeight: '700',
},

flowList: {
  gap: Spacing.sm,
},

flowOption: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 14,
  padding: Spacing.md,
  gap: Spacing.md,
},

flowOptionSelected: {
  borderColor: Colors.gold,
  borderWidth: 2,
},

flowEmoji: {
  fontSize: 24,
},

flowLabel: {
  flex: 1,
  color: Colors.cream,
  fontSize: 16,
  fontWeight: '600',
},

flowLabelSelected: {
  color: Colors.gold,
},

flowCheck: {
  color: Colors.gold,
  fontSize: 18,
  fontWeight: '700',
},

periodStartRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: Colors.surfaceLight,
  borderRadius: 14,
  padding: Spacing.md,
  gap: Spacing.md,
},

checkbox: {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: Colors.border,
  alignItems: 'center',
  justifyContent: 'center',
},

checkboxSelected: {
  backgroundColor: Colors.gold,
  borderColor: Colors.gold,
},

checkboxCheck: {
  color: Colors.background,
  fontSize: 15,
  fontWeight: '900',
},

periodStartTextGroup: {
  flex: 1,
  gap: 4,
},

periodStartTitle: {
  color: Colors.cream,
  fontSize: 15,
  fontWeight: '700',
},

periodStartDescription: {
  color: Colors.textSecondary,
  fontSize: 13,
  lineHeight: 19,
},

saveButtonDisabled: {
  opacity: 0.45,
},

moreForYouText: {
  color: Colors.textSecondary,
  lineHeight: 22,
},

});