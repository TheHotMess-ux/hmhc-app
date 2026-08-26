import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { FlowLevel } from '@/lib/flow';
import type { SleepLog } from '@/lib/sleep';

import type { FitnessLog } from '@/lib/fitness';

import FitnessScreen from './FitnessScreen';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import FlowScreen from './FlowScreen';
import MoodScreen from './MoodScreen';
import SleepScreen from './SleepScreen';
import SupplementsScreen from './SupplementsScreen';
import SymptomsScreen from './SymptomsScreen';

import type { QuickLogType } from './types';

type Props = {
  visible: boolean;
  activeLog: QuickLogType;

  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedSupplements: string[];

  selectedFlow: FlowLevel | null;
  startsNewPeriod: boolean;
  endsPeriod: boolean;

  selectedSleep: SleepLog | null;

  selectedFitness: FitnessLog | null;

  onMoodSelect: (
    mood: string,
  ) => void | Promise<void>;

  onSymptomsSave: (
    symptoms: string[],
  ) => void | Promise<void>;

onSupplementsSave: (
  supplements: string[],
) => void | Promise<void>;

  onFlowSave: (
  flow: FlowLevel,
  startsNewPeriod: boolean,
  endsPeriod: boolean,
) => void | Promise<void>;

onSleepSave: (
  sleep: SleepLog,
) => void | Promise<void>;

  onClose: () => void;

  onFitnessSave: (
  fitness: FitnessLog,
) => void | Promise<void>;
};

export default function QuickLogModal({
  visible,
  activeLog,
  selectedMood,
  selectedSymptoms,
  selectedSupplements,
  selectedFlow,
  startsNewPeriod,
  endsPeriod,
  selectedSleep,
  selectedFitness,
  onMoodSelect,
  onSymptomsSave,
  onSupplementsSave,
  onFlowSave,
  onSleepSave,
  onFitnessSave,
  onClose,
}: Props) {

  function getTitle(): string {
    switch (activeLog) {
      case 'mood':
        return 'How are you feeling?';

      case 'symptoms':
        return 'What is your body trying to tell you?';

      case 'flow':
        return 'How would you describe today’s bleeding?';

      case 'sleep':
        return 'How did you sleep?';

      case 'supplements':
        return 'Supplements';

      case 'fitness':
        return 'How did you move today?';

      default:
        return '';
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {getTitle()}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close daily check-in"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.closeButtonText}>
                ×
              </Text>
            </Pressable>
          </View>

          {activeLog === 'mood' && (
            <MoodScreen
              selectedMood={selectedMood}
              onSelect={async (mood) => {
                await onMoodSelect(mood);
                onClose();
              }}
            />
          )}

          {activeLog === 'symptoms' && (
            <SymptomsScreen
              selectedSymptoms={selectedSymptoms}
              onSave={async (symptoms) => {
                await onSymptomsSave(symptoms);
                onClose();
              }}
            />
          )}

{activeLog === 'supplements' && (
  <SupplementsScreen
    selectedSupplements={
      selectedSupplements
    }
    onSave={async (supplements) => {
      await onSupplementsSave(
        supplements,
      );
      onClose();
    }}
  />
)}

{activeLog === 'sleep' && (
  <SleepScreen
    selectedSleep={selectedSleep}
    onSave={async (sleep) => {
      await onSleepSave(sleep);
      onClose();
    }}
  />
)}

{activeLog === 'fitness' && (
  <FitnessScreen
    selectedFitness={selectedFitness}
    onSave={async (fitness) => {
      await onFitnessSave(fitness);
      onClose();
    }}
  />
)}

{activeLog === 'flow' && (

<FlowScreen
  selectedFlow={selectedFlow}
  startsNewPeriod={startsNewPeriod}
  endsPeriod={endsPeriod}
  onSave={async (
    flow,
    startsNewPeriodValue,
    endsPeriodValue,
  ) => {
    await onFlowSave(
      flow,
      startsNewPeriodValue,
      endsPeriodValue,
    );

    onClose();
  }}
/>

)}

          {activeLog !== 'mood' &&
          activeLog !== 'symptoms' &&
          activeLog !== 'flow' &&
          activeLog !== 'supplements' &&
          activeLog !== 'sleep' &&
          activeLog !== 'fitness' && (
              <>
                <Text style={styles.subtitle}>
                  Screen coming next...
                </Text>

                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={styles.buttonText}>
                    Close
                  </Text>
                </Pressable>
              </>
            )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
    padding: Spacing.lg,
  },

 card: {
  width: '100%',
  maxWidth: 620,
  maxHeight: '90%',
  flexShrink: 1,
  overflow: 'hidden',
  backgroundColor: Colors.surface,
  borderRadius: 20,
  padding: Spacing.lg,
  gap: Spacing.md,
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },

title: {
  flex: 1,
  color: Colors.text,
  fontSize: 21,
  fontWeight: '700',
  lineHeight: 26,
},

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: Colors.text,
    fontSize: 24,
    lineHeight: 26,
  },

  button: {
    marginTop: Spacing.md,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});