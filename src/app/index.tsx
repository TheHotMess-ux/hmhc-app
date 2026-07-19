import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SectionCard from '@/components/SectionCard';
import {
  getCyclePhase,
  getDailyPepTalk,
  getGreeting,
} from '@/lib/dashboard';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
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
const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
const [selectedMood, setSelectedMood] = useState<string | null>(null);
const [isSymptomsModalVisible, setIsSymptomsModalVisible] = useState(false);
const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
useEffect(() => {
  const loadMood = async () => {
    try {
      const savedMood = await AsyncStorage.getItem('todaysMood'); console.log('Mood loaded:', savedMood);

      if (savedMood !== null) {
        setSelectedMood(savedMood);
      }
    } catch (error) {
      console.error('Unable to load saved mood:', error);
    }
  };

  loadMood();
}, []);
useEffect(() => {
  const loadSymptoms = async () => {
    try {
      const savedSymptoms =
        await AsyncStorage.getItem('todaysSymptoms');

      if (savedSymptoms !== null) {
        setSelectedSymptoms(JSON.parse(savedSymptoms));
      }
    } catch (error) {
      console.error('Unable to load saved symptoms:', error);
    }
  };

  loadSymptoms();
}, []);
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
  const cycleDay = 18;
const phaseInsight = getCyclePhase(cycleDay);
const greeting = getGreeting('Sheena');
const pepTalk = getDailyPepTalk();
return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          THE HOT MESS HORMONE CLUB
        </Text>

        <Text style={styles.greeting}>{greeting}</Text>

        <Text style={styles.subtitle}>
          Your body has notes today.
        </Text>
      </View>

      <SectionCard title="Today's Hormone Briefing">
  <Text style={styles.phaseLabel}>
    Cycle Day {cycleDay} · {phaseInsight.phase} Phase
  </Text>

  <Text style={styles.bodyText}>
    {phaseInsight.summary}
  </Text>
</SectionCard>

     <SectionCard title="Feral Forecast">
  <Text style={styles.pepTalk}>{pepTalk}</Text>
</SectionCard>

<SectionCard title="Today's Mission">
  {phaseInsight.mission.map((item) => (
    <Text key={item} style={styles.bodyText}>
      ✓ {item}
    </Text>
  ))}
</SectionCard>

      <SectionCard title="Quick Log">
  <View style={styles.quickLogGrid}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log today's mood"
      onPress={() => setIsMoodModalVisible(true)}
      style={({ pressed }) => [
  styles.quickLogButton,
  selectedMood && styles.quickLogButtonSelected,
pressed && styles.buttonPressed,
]}>
  <Text style={styles.quickLogEmoji}>
  {selectedMood ? selectedMood.split(' ')[0] : '🙂'}
</Text>

      <Text style={styles.quickLogLabel}>Mood</Text>

      {selectedMood && (
        <Text style={styles.quickLogValue}>{selectedMood}</Text>
      )}
    </Pressable>

    <Pressable
  accessibilityRole="button"
  accessibilityLabel="Log today's symptoms"
  onPress={() => setIsSymptomsModalVisible(true)}
  style={({ pressed }) => [
    styles.quickLogButton,
    selectedSymptoms.length > 0 &&
      styles.quickLogButtonSelected,
    pressed && styles.buttonPressed,
  ]}>
  <Text style={styles.quickLogEmoji}>
    {selectedSymptoms.length > 0 ? '✓' : '🔥'}
  </Text>

  <Text style={styles.quickLogLabel}>Symptoms</Text>

  {selectedSymptoms.length > 0 ? (
    <Text style={styles.quickLogValue}>
      {selectedSymptoms.length}{' '}
      {selectedSymptoms.length === 1 ? 'symptom' : 'symptoms'}
    </Text>
  ) : (
    <Text style={styles.comingSoon}>Tap to log</Text>
  )}
</Pressable>

    <View style={styles.quickLogButton}>
      <Text style={styles.quickLogEmoji}>💊</Text>
      <Text style={styles.quickLogLabel}>Supplements</Text>
      <Text style={styles.comingSoon}>Coming soon</Text>
    </View>

    <View style={styles.quickLogButton}>
      <Text style={styles.quickLogEmoji}>😴</Text>
      <Text style={styles.quickLogLabel}>Sleep</Text>
      <Text style={styles.comingSoon}>Coming soon</Text>
    </View>
  </View>
</SectionCard>
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
});