import { Ionicons } from '@expo/vector-icons';

import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  getAccessMode,
} from '@/lib/access';

import {
  emptyUserProfile,
  loadUserProfile,
  saveUserProfile,
} from '@/lib/profile';

import type {
  UserProfile,
} from '@/lib/profile';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

function isValidDateOfBirth(
  value: string,
): boolean {
  if (value.length === 0) {
    return true;
  }

  const datePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    return false;
  }

  const [
    yearValue,
    monthValue,
    dayValue,
  ] = value.split('-').map(Number);

  const date = new Date(
    yearValue,
    monthValue - 1,
    dayValue,
  );

  const dateIsReal =
    date.getFullYear() === yearValue &&
    date.getMonth() === monthValue - 1 &&
    date.getDate() === dayValue;

  const dateIsNotInFuture =
    date <= new Date();

  return (
    dateIsReal &&
    dateIsNotInFuture
  );
}

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<UserProfile>(
      emptyUserProfile,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const accessMode =
    getAccessMode();

  useEffect(() => {
    async function loadProfile() {
      const savedProfile =
        await loadUserProfile();

      setProfile(savedProfile);
      setIsLoading(false);
    }

    void loadProfile();
  }, []);

  function updateProfile(
    field: keyof UserProfile,
    value: string,
  ) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  }

  async function handleSave() {
    Keyboard.dismiss();

  async function handleBetaFeedback() {
  const subject = encodeURIComponent(
    'HMHC Beta Feedback',
  );

  const body = encodeURIComponent(
    `Hi HMHC,

What I was doing:


What worked well:


What felt confusing or broken:


Something I wish HMHC included:


Device: ${Platform.OS} ${Platform.Version}
`,
  );

  const emailUrl =
    `mailto:sheena@thehotmesshormoneclub.com` +
    `?subject=${subject}&body=${body}`;

  try {
    await Linking.openURL(emailUrl);
  } catch (error) {
    console.error(
      'Unable to open beta feedback email:',
      error,
    );

    Alert.alert(
      'Unable to open email',
      'Please send your feedback directly to sheena@thehotmesshormoneclub.com.',
    );
  }
}  

    const cleanedDateOfBirth =
      profile.dateOfBirth.trim();

    if (
      !isValidDateOfBirth(
        cleanedDateOfBirth,
      )
    ) {
      Alert.alert(
        'Check the date of birth',
        'Please use the YYYY-MM-DD format, such as 1984-08-16.',
      );

      return;
    }

    try {
      setIsSaving(true);

      const cleanedProfile = {
        preferredName:
          profile.preferredName.trim(),

        fullName:
          profile.fullName.trim(),

        dateOfBirth:
          cleanedDateOfBirth,
      };

      await saveUserProfile(
        cleanedProfile,
      );

      setProfile(cleanedProfile);

      Alert.alert(
        'Profile saved',
        'Your HMHC preferences have been updated.',
      );
    } catch {
      Alert.alert(
        'Unable to save',
        'Your profile could not be saved. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

async function handleBetaFeedback() {
  const subject = encodeURIComponent(
    'HMHC Beta Feedback',
  );

  const body = encodeURIComponent(
    `Hi HMHC,

What I was doing:


What worked well:


What felt confusing or broken:


Something I wish HMHC included:


Device: ${Platform.OS} ${Platform.Version}
`,
  );

  const emailUrl =
    `mailto:sheena@thehotmesshormoneclub.com` +
    `?subject=${subject}&body=${body}`;

  try {
    await Linking.openURL(emailUrl);
  } catch (error) {
    console.error(
      'Unable to open beta feedback email:',
      error,
    );

    Alert.alert(
      'Unable to open email',
      'Please send your feedback directly to sheena@thehotmesshormoneclub.com.',
    );
  }
}

  const accessTitle =
    accessMode === 'beta'
      ? 'Full Beta Access'
      : accessMode === 'premium'
        ? 'HMHC Premium'
        : 'HMHC Free';

  const accessDescription =
    accessMode === 'beta'
      ? 'All premium features are unlocked during beta testing.'
      : accessMode === 'premium'
        ? 'Your premium features are unlocked.'
        : 'Core tracking features are available.';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          YOUR HMHC
        </Text>

        <Text style={styles.title}>
          Profile
        </Text>

        <Text style={styles.description}>
          Personalize the app and decide what
          information appears in your
          Doctor&apos;s Report.
        </Text>
      </View>

      <View style={styles.accessCard}>
        <View style={styles.accessIcon}>
          <Ionicons
            name={
              accessMode === 'beta'
                ? 'flask'
                : accessMode === 'premium'
                  ? 'sparkles'
                  : 'person'
            }
            color={Colors.background}
            size={24}
          />
        </View>

        <View style={styles.accessText}>
          <Text style={styles.accessTitle}>
            {accessTitle}
          </Text>

          <Text
            style={styles.accessDescription}>
            {accessDescription}
          </Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>
          About You
        </Text>

        <Text style={styles.cardDescription}>
          Preferred name personalizes the app.
          Full name and date of birth are optional
          and can be added to exported reports.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Preferred name
          </Text>

          <TextInput
            accessibilityLabel="Preferred name"
            value={profile.preferredName}
            editable={!isLoading}
            onChangeText={(value) =>
              updateProfile(
                'preferredName',
                value,
              )
            }
            placeholder="What should HMHC call you?"
            placeholderTextColor={
              Colors.textSecondary
            }
            autoCapitalize="words"
            returnKeyType="next"
            style={styles.input}
          />

          <Text style={styles.helperText}>
            Used in greetings and encouragement
            throughout the app.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Full name
            <Text style={styles.optional}>
              {' '}· Optional
            </Text>
          </Text>

          <TextInput
            accessibilityLabel="Full name for Doctor's Report"
            value={profile.fullName}
            editable={!isLoading}
            onChangeText={(value) =>
              updateProfile(
                'fullName',
                value,
              )
            }
            placeholder="Name for your report"
            placeholderTextColor={
              Colors.textSecondary
            }
            autoCapitalize="words"
            returnKeyType="next"
            style={styles.input}
          />

          <Text style={styles.helperText}>
            Used only where identification is
            helpful, such as your exported report.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Date of birth
            <Text style={styles.optional}>
              {' '}· Optional
            </Text>
          </Text>

          <TextInput
            accessibilityLabel="Date of birth"
            value={profile.dateOfBirth}
            editable={!isLoading}
            onChangeText={(value) =>
              updateProfile(
                'dateOfBirth',
                value,
              )
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor={
              Colors.textSecondary
            }
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
            returnKeyType="done"
            onSubmitEditing={() => {
              void handleSave();
            }}
            style={styles.input}
          />

          <Text style={styles.helperText}>
            Use YYYY-MM-DD. This can help identify
            the report in a medical record.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save profile"
          disabled={
            isLoading ||
            isSaving
          }
          onPress={() => {
            void handleSave();
          }}
          style={({ pressed }) => [
            styles.saveButton,
            (isLoading || isSaving) &&
              styles.saveButtonDisabled,
            pressed &&
              !isLoading &&
              !isSaving &&
              styles.buttonPressed,
          ]}>
          <Text style={styles.saveButtonText}>
            {isSaving
              ? 'Saving…'
              : 'Save Profile'}
          </Text>
        </Pressable>
      </View>

<View style={styles.feedbackCard}>
  <View style={styles.feedbackHeading}>
    <View style={styles.feedbackIcon}>
      <Ionicons
        name="chatbubble-ellipses-outline"
        color={Colors.background}
        size={24}
      />
    </View>

    <View style={styles.feedbackText}>
      <Text style={styles.feedbackTitle}>
        Help shape HMHC
      </Text>

      <Text style={styles.feedbackDescription}>
        Found something confusing, broken, or
        unexpectedly brilliant? Send feedback
        directly to the human building this app.
      </Text>
    </View>
  </View>

  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Send HMHC beta feedback"
    onPress={() => {
      void handleBetaFeedback();
    }}
    style={({ pressed }) => [
      styles.feedbackButton,
      pressed && styles.buttonPressed,
    ]}>
    <Ionicons
      name="mail-outline"
      color={Colors.background}
      size={20}
    />

    <Text style={styles.feedbackButtonText}>
      Send Beta Feedback
    </Text>
  </Pressable>
</View>

      <View style={styles.privacyCard}>
        <Ionicons
          name="shield-checkmark-outline"
          color={Colors.gold}
          size={26}
        />

        <View style={styles.privacyText}>
          <Text style={styles.privacyTitle}>
            Local during beta
          </Text>

          <Text
            style={styles.privacyDescription}>
            Profile information is stored locally
            on this device. Optional report details
            are shared only when you choose to
            export and share a report.
          </Text>
        </View>
      </View>
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
    paddingTop: Spacing.xl,
    paddingBottom: 110,
    gap: Spacing.lg,
  },

  header: {
    gap: Spacing.sm,
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
    fontWeight: '900',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },

  accessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.gold,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  accessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  accessText: {
    flex: 1,
    gap: 4,
  },

  accessTitle: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '900',
  },

  accessDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  formCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: '900',
  },

  cardDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  field: {
    gap: Spacing.sm,
  },

  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  optional: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  input: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  saveButton: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 18,
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  privacyText: {
    flex: 1,
    gap: 5,
  },

  privacyTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  privacyDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  feedbackCard: {
  backgroundColor: Colors.surface,
  borderColor: Colors.gold,
  borderWidth: 1,
  borderRadius: 22,
  padding: Spacing.lg,
  gap: Spacing.lg,
},

feedbackHeading: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: Spacing.md,
},

feedbackIcon: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: Colors.gold,
  alignItems: 'center',
  justifyContent: 'center',
},

feedbackText: {
  flex: 1,
  gap: 5,
},

feedbackTitle: {
  color: Colors.text,
  fontSize: 17,
  fontWeight: '900',
},

feedbackDescription: {
  color: Colors.textSecondary,
  fontSize: 13,
  lineHeight: 20,
},

feedbackButton: {
  minHeight: 48,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.gold,
  borderRadius: 14,
  paddingHorizontal: Spacing.md,
  gap: Spacing.sm,
},

feedbackButtonText: {
  color: Colors.background,
  fontSize: 15,
  fontWeight: '900',
},

});