import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    isBetaAccess,
} from '@/lib/access';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

const premiumFeatures = [
  {
    icon: 'document-text-outline' as const,
    title: 'Doctor-Ready Reports',
    description:
      'Turn your logged experiences into a clear 7-, 30-, or 90-day summary.',
  },
  {
    icon: 'share-social-outline' as const,
    title: 'Generate & Share PDFs',
    description:
      'Create an appointment-friendly report without relying on your memory under pressure.',
  },
  {
    icon: 'analytics-outline' as const,
    title: 'Deeper Pattern Insights',
    description:
      'See connections across symptoms, mood, sleep, supplements, and bleeding.',
  },
  {
    icon: 'time-outline' as const,
    title: 'Extended History',
    description:
      'Look beyond today and understand what has been repeating over time.',
  },
];

export default function PaywallScreen() {
  const betaAccessIsActive =
    isBetaAccess();

  function handlePremiumPress() {
    if (betaAccessIsActive) {
      router.back();
      return;
    }

    Alert.alert(
      'Premium is coming',
      'Secure subscription purchases will be connected before the public launch.',
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>
          THE HOT MESS HORMONE CLUB
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close premium information"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}>
          <Ionicons
            name="close"
            color={Colors.text}
            size={24}
          />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.crown}>
          <Ionicons
            name="sparkles"
            color={Colors.background}
            size={27}
          />
        </View>

        <Text style={styles.eyebrow}>
          HMHC PREMIUM
        </Text>

        <Text style={styles.title}>
          More clarity.
          {'\n'}
          Less emotional paperwork.
        </Text>

        <Text style={styles.description}>
          Your experiences deserve to be recorded,
          understood, and taken seriously—without
          requiring you to remember every detail
          while sitting in a doctor&apos;s office.
        </Text>
      </View>

      {betaAccessIsActive && (
        <View style={styles.betaCard}>
          <Ionicons
            name="flask-outline"
            color={Colors.gold}
            size={25}
          />

          <View style={styles.betaText}>
            <Text style={styles.betaTitle}>
              Beta access is active
            </Text>

            <Text style={styles.betaDescription}>
              Everything is unlocked while you
              help us make HMHC even better.
              No payment is required during beta.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.featureCard}>
        <Text style={styles.featureHeading}>
          Premium includes
        </Text>

        <View style={styles.featureList}>
          {premiumFeatures.map((feature) => (
            <View
              key={feature.title}
              style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon}
                  color={Colors.gold}
                  size={23}
                />
              </View>

              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>
                  {feature.title}
                </Text>

                <Text
                  style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.promiseCard}>
        <Text style={styles.promiseEmoji}>
          🖤
        </Text>

        <View style={styles.promiseText}>
          <Text style={styles.promiseTitle}>
            Built for women in the thick of it
          </Text>

          <Text style={styles.promiseDescription}>
            HMHC is designed to reduce mental load,
            validate your experience, and help you
            feel a little less alone in the hormonal
            wilderness.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          betaAccessIsActive
            ? 'Continue with beta access'
            : 'View premium access'
        }
        onPress={handlePremiumPress}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.primaryButtonText}>
          {betaAccessIsActive
            ? 'Continue With Full Beta Access'
            : 'Unlock HMHC Premium'}
        </Text>

        <Ionicons
          name="arrow-forward"
          color={Colors.background}
          size={20}
        />
      </Pressable>

      <Text style={styles.footer}>
        Beta testers retain full access throughout
        the testing period.
      </Text>
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
    paddingTop: 50,
    paddingBottom: 60,
    gap: Spacing.lg,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },

  brand: {
    flex: 1,
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.7,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  hero: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },

  crown: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    textAlign: 'center',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },

  betaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  betaText: {
    flex: 1,
    gap: 5,
  },

  betaTitle: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '800',
  },

  betaDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  featureCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  featureHeading: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: '900',
  },

  featureList: {
    gap: Spacing.lg,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    flex: 1,
    gap: 4,
  },

  featureTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  featureDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  promiseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  promiseEmoji: {
    fontSize: 25,
  },

  promiseText: {
    flex: 1,
    gap: 5,
  },

  promiseTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  promiseDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  primaryButtonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '900',
  },

  footer: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});