import {
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  morningEnabled: boolean;
  onMorningChange: (
    value: boolean,
  ) => void;

   eveningEnabled: boolean;
  onEveningChange: (
    value: boolean,
  ) => void;
};

export default function DailyReminderCard({
  morningEnabled,
  onMorningChange,
  eveningEnabled,
  onEveningChange,
}: Props) {  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Check-In Reminders
      </Text>

      <Text style={styles.description}>
        Optional nudges to help you remember
        your daily check-ins.
      </Text>
<View style={styles.reminderRow}>
  <View style={styles.reminderText}>
    <Text style={styles.reminderTitle}>
      ☀️ Morning check-in
    </Text>

    <Text style={styles.reminderSubtitle}>
      Start the day with a quick check-in.
    </Text>
  </View>

  <Switch
    value={morningEnabled}
    onValueChange={onMorningChange}
  />
</View>

<View style={styles.reminderRow}>
  <View style={styles.reminderText}>
    <Text style={styles.reminderTitle}>
      🌙 Evening check-in
    </Text>

    <Text style={styles.reminderSubtitle}>
      Wrap up the day before your brain
      deletes the evidence.
    </Text>
  </View>

  <Switch
    value={eveningEnabled}
    onValueChange={onEveningChange}
  />
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: Colors.surface,
  borderColor: Colors.border,
  borderWidth: 1,
  borderRadius: 22,
  padding: Spacing.lg,
  gap: Spacing.lg,
},

title: {
  color: Colors.text,
  fontSize: 21,
  fontWeight: '900',
},

description: {
  color: Colors.textSecondary,
  fontSize: 14,
  lineHeight: 21,
},

  reminderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginTop: 8,
},

reminderText: {
  flex: 1,
  gap: 2,
},

reminderTitle: {
  color: Colors.text,
  fontSize: 16,
  fontWeight: '600',
},

reminderSubtitle: {
  color: Colors.textSecondary,
  fontSize: 13,
  lineHeight: 18,
},
});