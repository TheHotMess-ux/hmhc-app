import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import QuickLogHub from '@/components/quickLog/QuickLogHub';
import type { FlowLevel } from '@/lib/flow';
import { flowOptions } from '@/lib/flow';
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

import {
  getCycleDayFromPeriodStart,
  getMostRecentPeriodStart,
} from '@/lib/cycleTracking';

import {
  getCheckInStreak,
} from '@/lib/companion/memory';

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

const [selectedFlow, setSelectedFlow] =
  useState<FlowLevel | null>(null);

const [startsNewPeriod, setStartsNewPeriod] =
  useState(false);

const [endsPeriod, setEndsPeriod] =
  useState(false);

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

const cycleDay =
  lastPeriodStart
    ? getCycleDayFromPeriodStart(
        lastPeriodStart,
      )
    : 18;

const forecast =
  getFeralForecast(cycleDay);

  const today = new Date()
  .toISOString()
  .split('T')[0];

const dailyEntry = {
  date: today,
  cycleDay,
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

const phaseInsight = getDashboardCyclePhase(cycleDay);
const cyclePhase = getCyclePhaseData(cycleDay);

const feralLevel = getFeralLevel({
  mood: selectedMood,
  symptoms: selectedSymptoms,
  flow: selectedFlow,
  cyclePhase: phaseInsight.phase,
});

const symptomInsight = getSymptomInsight(
  phaseInsight.phase,
  selectedSymptoms,
);
const greeting = getSmartGreeting();

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
  {greeting.emoji} {greeting.title}
</Text>

<Text style={styles.subtitle}>
  {greeting.subtitle}
</Text>
      </View>

<MorningBriefingCard
  name="Sheena"
  phase={cyclePhase.phase}
  cycleDay={cycleDay}
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
  coffeeForecast={forecast.coffeeForecast}
  brainFogForecast={forecast.brainFogForecast}
  patienceForecast={forecast.patienceForecast}
  survivalStrategy={forecast.survivalStrategy}
  feralLevel={feralLevel}
/>

<HormoneBriefingCard
  title="Hormone Briefing"
  phase={`${cyclePhase.emoji} ${cyclePhase.title}`}
  description={cyclePhase.description}
  encouragement={cyclePhase.encouragement}
/>

<MissionCard mission={phaseInsight.mission} />

{/*
<QuickLogCard
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
  selectedFlow={selectedFlow}
  onMoodPress={() => setIsMoodModalVisible(true)}
  onSymptomsPress={() => setIsSymptomsModalVisible(true)}
  onFlowPress={() => {
    setIsMoodModalVisible(false);
    setIsSymptomsModalVisible(false);
    setIsFlowModalVisible(true);
  }}
/>
*/}

<QuickLogHub
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
  selectedFlow={selectedFlow}
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
/>

<MoreForYouCard
  items={moreForYouItems}
/>

<Modal
  animationType="fade"
  transparent
  visible={isMoodModalVisible}
  onRequestClose={() => setIsMoodModalVisible(false)}>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalEyebrow}>QUICK LOG</Text>
          <Text style={styles.modalTitle}>How are we doing today?</Text>
        </View>

        <Pressable
  accessibilityRole="button"
  accessibilityLabel="Close mood log"
  onPress={() => setIsMoodModalVisible(false)}
  style={({ pressed }) => [
    styles.closeButton,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.closeButtonText}>×</Text>
</Pressable>
      </View>

      <Text style={styles.modalDescription}>
        Choose the answer that requires the least emotional paperwork.
      </Text>

      <View style={styles.moodList}>
        {moodOptions.map((mood) => (
          <Pressable
            key={mood.label}
            accessibilityRole="button"
            accessibilityLabel={`Log mood as ${mood.label}`}
            onPress={async () => {
  const value = `${mood.emoji} ${mood.label}`;

  setSelectedMood(value);

  await AsyncStorage.setItem(
    'todaysMood',
    value
  );

  await saveTodayToJournal({
  mood: value,
});

console.log('Mood saved:', value);
  setIsMoodModalVisible(false);
}}
            style={({ pressed }) => [
              styles.moodOption,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </Pressable>
        ))}
      </View>

      {selectedMood && (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Clear selected mood"
    onPress={async () => {
      setSelectedMood(null);

      await AsyncStorage.removeItem('todaysMood');

      setIsMoodModalVisible(false);
    }}>
    <Text style={styles.clearMood}>Clear today&apos;s mood</Text>
  </Pressable>
)}
    </View>
  </View>
</Modal>
<Modal
  animationType="fade"
  transparent
  visible={isSymptomsModalVisible}
  onRequestClose={() => setIsSymptomsModalVisible(false)}>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalEyebrow}>QUICK LOG</Text>
          <Text style={styles.modalTitle}>
            What is your body complaining about?
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close symptoms log"
          onPress={() => setIsSymptomsModalVisible(false)}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>

      <Text style={styles.modalDescription}>
        Select everything that applies. Your hormones may have
        submitted several grievances.
      </Text>

{false && (
    <Modal
    animationType="fade"
    transparent
    visible
    onRequestClose={() => setIsFlowModalVisible(false)}
  >
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalEyebrow}>QUICK LOG</Text>

          <Text style={styles.modalTitle}>
            What is today’s flow doing?
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close flow log"
          onPress={() => setIsFlowModalVisible(false)}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>

      <Text style={styles.modalDescription}>
        Choose the option that best matches today. Perimenopause may reserve the
        right to change the plot without notice.
      </Text>

      <View style={styles.flowList}>
        {flowOptions.map((option) => {
          const isSelected = selectedFlow === option.level;

          return (
            <Pressable
              key={option.level}
              accessibilityRole="button"
              accessibilityLabel={`Log flow as ${option.label}`}
              onPress={() => {
                setSelectedFlow(option.level);

                if (
                  option.level === 'None' ||
                  option.level === 'Spotting'
                ) {
                  setStartsNewPeriod(false);
                }
              }}
              style={({ pressed }) => [
                styles.flowOption,
                isSelected && styles.flowOptionSelected,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.flowEmoji}>
                {option.emoji}
              </Text>

              <Text
                style={[
                  styles.flowLabel,
                  isSelected && styles.flowLabelSelected,
                ]}
              >
                {option.label}
              </Text>

              {isSelected && (
                <Text style={styles.flowCheck}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {selectedFlow &&
        selectedFlow !== 'None' &&
        selectedFlow !== 'Spotting' && (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: startsNewPeriod,
            }}
            accessibilityLabel="This is the first day of a new period"
            onPress={() =>
              setStartsNewPeriod((currentValue) => !currentValue)
            }
            style={styles.periodStartRow}
          >
            <View
              style={[
                styles.checkbox,
                startsNewPeriod && styles.checkboxSelected,
              ]}
            >
              {startsNewPeriod && (
                <Text style={styles.checkboxCheck}>✓</Text>
              )}
            </View>

            <View style={styles.periodStartTextGroup}>
              <Text style={styles.periodStartTitle}>
                This is the first day of a new period
              </Text>

              <Text style={styles.periodStartDescription}>
                This helps us track your cycle and menopause journey more
                accurately.
              </Text>
            </View>
          </Pressable>
        )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save flow"
        disabled={!selectedFlow}
        onPress={async () => {
          if (!selectedFlow) {
            return;
          }

          try {
            await AsyncStorage.setItem(
              'todaysFlow',
              selectedFlow,
            );

            await AsyncStorage.setItem(
              'startsNewPeriod',
              JSON.stringify(startsNewPeriod),
            );

            await saveTodayToJournal({
              flow: selectedFlow,
              startsNewPeriod,
            });

            setIsFlowModalVisible(false);
          } catch (error) {
            console.error('Unable to save flow:', error);
          }
        }}
        style={({ pressed }) => [
          styles.saveButton,
          !selectedFlow && styles.saveButtonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.saveButtonText}>
          Save Flow
        </Text>
      </Pressable>
    </View>
  </View>
  </Modal>
)}

      <ScrollView
        style={styles.symptomScroll}
        contentContainerStyle={styles.symptomGrid}>
        {symptomOptions.map((symptom) => {
          const isSelected = selectedSymptoms.includes(
            symptom.label,
          );

          return (
            <Pressable
              key={symptom.label}
              accessibilityRole="button"
              accessibilityLabel={`Log ${symptom.label}`}
              onPress={() => toggleSymptom(symptom.label)}
              style={({ pressed }) => [
                styles.symptomOption,
                isSelected && styles.symptomOptionSelected,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.symptomEmoji}>
                {symptom.emoji}
              </Text>

              <Text
                style={[
                  styles.symptomLabel,
                  isSelected && styles.symptomLabelSelected,
                ]}>
                {symptom.label}
              </Text>

              {isSelected && (
                <Text style={styles.symptomCheck}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save selected symptoms"
        onPress={async () => {
          try {
            await AsyncStorage.setItem(
              'todaysSymptoms',
              JSON.stringify(selectedSymptoms),
            );

            await saveTodayToJournal({
  symptoms: selectedSymptoms,
});

            setIsSymptomsModalVisible(false);
          } catch (error) {
            console.error(
              'Unable to save symptoms:',
              error,
            );
          }
        }}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.saveButtonText}>
          Save {selectedSymptoms.length || ''}{' '}
          {selectedSymptoms.length === 1
            ? 'Symptom'
            : 'Symptoms'}
        </Text>
      </Pressable>

      {selectedSymptoms.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear selected symptoms"
          onPress={async () => {
            setSelectedSymptoms([]);
            await AsyncStorage.removeItem('todaysSymptoms');
            setIsSymptomsModalVisible(false);
          }}>
          <Text style={styles.clearMood}>
            Clear today&apos;s symptoms
          </Text>
        </Pressable>
      )}
    </View>
  </View>
</Modal>
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