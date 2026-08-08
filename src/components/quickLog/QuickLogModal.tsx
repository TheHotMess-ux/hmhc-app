import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { FlowLevel } from '@/lib/flow';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

import FlowScreen from './FlowScreen';
import MoodScreen from './MoodScreen';
import SymptomsScreen from './SymptomsScreen';

import type { QuickLogType } from './types';

type Props = {
  visible: boolean;
  activeLog: QuickLogType;

  selectedMood: string | null;
  selectedSymptoms: string[];

  selectedFlow: FlowLevel | null;
  startsNewPeriod: boolean;
  endsPeriod: boolean;

  onMoodSelect: (
    mood: string,
  ) => void | Promise<void>;

  onSymptomsSave: (
    symptoms: string[],
  ) => void | Promise<void>;

  onFlowSave: (
  flow: FlowLevel,
  startsNewPeriod: boolean,
  endsPeriod: boolean,
) => void | Promise<void>;

  onClose: () => void;
};

export default function QuickLogModal({
  visible,
  activeLog,
  selectedMood,
  selectedSymptoms,
  selectedFlow,
  startsNewPeriod,
  endsPeriod,
  onMoodSelect,
  onSymptomsSave,
  onFlowSave,
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

      case 'energy':
        return 'Energy';

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
            activeLog !== 'flow' && (
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
    fontSize: 24,
    fontWeight: '700',
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