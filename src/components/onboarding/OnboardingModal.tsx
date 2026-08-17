import { Ionicons } from '@expo/vector-icons';

import {
    useEffect,
    useState,
} from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    completeOnboarding,
} from '@/lib/onboarding';

import {
    loadUserProfile,
    saveUserProfile,
} from '@/lib/profile';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  visible: boolean;
  onComplete: () => void;
};

type OnboardingStep =
  | 0
  | 1
  | 2;

export default function OnboardingModal({
  visible,
  onComplete,
}: Props) {
  const [step, setStep] =
    useState<OnboardingStep>(0);

  const [preferredName, setPreferredName] =
    useState('');

  const [isFinishing, setIsFinishing] =
    useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let isActive = true;

    async function prepareOnboarding() {
      const savedProfile =
        await loadUserProfile();

      if (isActive) {
        setPreferredName(
          savedProfile.preferredName,
        );
      }
    }

    void prepareOnboarding();

    return () => {
      isActive = false;
    };
  }, [visible]);

  function handleBack() {
    if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    }
  }

  async function handleFinish() {
    try {
      setIsFinishing(true);

      const savedProfile =
        await loadUserProfile();

      await saveUserProfile({
        ...savedProfile,
        preferredName:
          preferredName.trim() ||
          savedProfile.preferredName,
      });

      await completeOnboarding();

      onComplete();
    } catch (error) {
      console.error(
        'Unable to finish onboarding:',
        error,
      );

      Alert.alert(
        'Unable to finish setup',
        'Your preferences could not be saved. Please try again.',
      );
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleBack}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }>
          <ScrollView
            contentContainerStyle={
              styles.content
            }
            keyboardShouldPersistTaps="handled">
            <View style={styles.topBar}>
              {step > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  onPress={handleBack}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}>
                  <Ionicons
                    name="arrow-back"
                    color={Colors.text}
                    size={22}
                  />
                </Pressable>
              ) : (
                <View style={styles.backPlaceholder} />
              )}

              <View style={styles.progress}>
                {[0, 1, 2].map((dot) => (
                  <View
                    key={dot}
                    style={[
                      styles.progressDot,
                      dot === step &&
                        styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.backPlaceholder} />
            </View>

            {step === 0 && (
              <View style={styles.step}>
                <View style={styles.heroIcon}>
                  <Ionicons
                    name="heart"
                    color={Colors.background}
                    size={38}
                  />
                </View>

                <Text style={styles.eyebrow}>
                  WELCOME TO HMHC
                </Text>

                <Text style={styles.title}>
                  Your hormones have entered the
                  chat.
                </Text>

                <Text style={styles.description}>
                  HMHC helps you track what is
                  happening, notice meaningful
                  patterns, and feel a little less
                  alone while your body freelances
                  without permission.
                </Text>

                <View style={styles.featureList}>
                  <View style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      color={Colors.gold}
                      size={24}
                    />

                    <Text style={styles.featureText}>
                      Quick daily tracking without
                      unnecessary emotional paperwork
                    </Text>
                  </View>

                  <View style={styles.featureRow}>
                    <Ionicons
                      name="analytics-outline"
                      color={Colors.gold}
                      size={24}
                    />

                    <Text style={styles.featureText}>
                      Patterns across symptoms, mood,
                      sleep, supplements, and bleeding
                    </Text>
                  </View>

                  <View style={styles.featureRow}>
                    <Ionicons
                      name="document-text-outline"
                      color={Colors.gold}
                      size={24}
                    />

                    <Text style={styles.featureText}>
                      Doctor-ready reports when
                      remembering everything feels
                      impossible
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Begin HMHC setup"
                  onPress={() => setStep(1)}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>
                    Let&apos;s make this yours
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    color={Colors.background}
                    size={20}
                  />
                </Pressable>
              </View>
            )}

            {step === 1 && (
              <View style={styles.step}>
                <View style={styles.smallIcon}>
                  <Ionicons
                    name="person-outline"
                    color={Colors.gold}
                    size={30}
                  />
                </View>

                <Text style={styles.eyebrow}>
                  A LITTLE PERSONALIZATION
                </Text>

                <Text style={styles.title}>
                  What should HMHC call you?
                </Text>

                <Text style={styles.description}>
                  Your preferred name makes greetings
                  and encouragement feel personal.
                  It&apos;s optional—but considerably
                  nicer than “Hey, You.”
                </Text>

                <View style={styles.field}>
                  <Text style={styles.label}>
                    Preferred name
                  </Text>

                  <TextInput
                    accessibilityLabel="Preferred name"
                    value={preferredName}
                    onChangeText={setPreferredName}
                    placeholder="What should we call you?"
                    placeholderTextColor={
                      Colors.textSecondary
                    }
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    style={styles.input}
                  />

                  <Text style={styles.helperText}>
                    You can change this later from
                    Profile.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continue onboarding"
                  onPress={() => setStep(2)}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>
                    Continue
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    color={Colors.background}
                    size={20}
                  />
                </Pressable>
              </View>
            )}

            {step === 2 && (
              <View style={styles.step}>
                <View style={styles.smallIcon}>
                  <Ionicons
                    name="sparkles"
                    color={Colors.gold}
                    size={30}
                  />
                </View>

                <Text style={styles.eyebrow}>
                  YOU&apos;RE IN
                </Text>

                <Text style={styles.title}>
                  Full Premium access during beta.
                </Text>

                <Text style={styles.description}>
                  Explore everything, use it like a
                  real human with real hormones, and
                  tell us where the app needs more
                  support—or fewer opinions.
                </Text>

                <View style={styles.infoList}>
                  <View style={styles.infoCard}>
                    <Ionicons
                      name="diamond-outline"
                      color={Colors.gold}
                      size={26}
                    />

                    <View style={styles.infoText}>
                      <Text style={styles.infoTitle}>
                        Premium unlocked
                      </Text>

                      <Text style={styles.infoDescription}>
                        Advanced Patterns and
                        Doctor&apos;s Reports are
                        available throughout beta.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      color={Colors.gold}
                      size={26}
                    />

                    <View style={styles.infoText}>
                      <Text style={styles.infoTitle}>
                        Stored locally
                      </Text>

                      <Text style={styles.infoDescription}>
                        During beta, your profile and
                        health logs stay on this device
                        unless you choose to export or
                        share them.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Ionicons
                      name="options-outline"
                      color={Colors.gold}
                      size={26}
                    />

                    <View style={styles.infoText}>
                      <Text style={styles.infoTitle}>
                        Cycle tracking is optional
                      </Text>

                      <Text style={styles.infoDescription}>
                        Mood, symptoms, sleep,
                        supplements, insights, and
                        reports remain useful with or
                        without periods.
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Finish HMHC setup"
                  disabled={isFinishing}
                  onPress={() => {
                    void handleFinish();
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    isFinishing &&
                      styles.primaryButtonDisabled,
                    pressed &&
                      !isFinishing &&
                      styles.buttonPressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>
                    {isFinishing
                      ? 'Finishing setup…'
                      : 'Enter HMHC'}
                  </Text>

                  {!isFinishing && (
                    <Ionicons
                      name="arrow-forward"
                      color={Colors.background}
                      size={20}
                    />
                  )}
                </Pressable>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardArea: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backPlaceholder: {
    width: 42,
    height: 42,
  },

  progress: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },

  progressDotActive: {
    width: 24,
    backgroundColor: Colors.gold,
  },

  step: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 41,
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },

  featureList: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },

  featureText: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  field: {
    gap: Spacing.sm,
  },

  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 15,
    color: Colors.text,
    fontSize: 17,
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  infoList: {
    gap: Spacing.md,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  infoText: {
    flex: 1,
    gap: 4,
  },

  infoTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '900',
  },

  infoDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 15,
    gap: Spacing.sm,
  },

  primaryButtonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },
});