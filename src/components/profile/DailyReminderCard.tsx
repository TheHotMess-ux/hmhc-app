import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  useState,
} from 'react';

import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

type Props = {
  morningEnabled: boolean;

  morningTime: {
  hour: number;
  minute: number;
};

onMorningTimeChange: (
  time: {
    hour: number;
    minute: number;
  },
) => void;

  onMorningChange: (
    value: boolean,
  ) => void;

   eveningEnabled: boolean;
   eveningTime: {
  hour: number;
  minute: number;
};

onEveningTimeChange: (
  time: {
    hour: number;
    minute: number;
  },
) => void;

  onEveningChange: (
    value: boolean,
  ) => void;
};

export default function DailyReminderCard({
  morningEnabled,
  morningTime,
  onMorningTimeChange,
  onMorningChange,
  eveningEnabled,
  eveningTime,
  onEveningChange,
  onEveningTimeChange,
}: Props) {
  
  const [
  showMorningTimePicker,
  setShowMorningTimePicker,
] = useState(false);

const [
  showEveningTimePicker,
  setShowEveningTimePicker,
] = useState(false);

const morningTimeLabel =
  new Date(
    2000,
    0,
    1,
    morningTime.hour,
    morningTime.minute,
  ).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const eveningTimeLabel =
  new Date(
    2000,
    0,
    1,
    eveningTime.hour,
    eveningTime.minute,
  ).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
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

 <Pressable
  style={styles.timeButton}
  onPress={() => {
    setShowMorningTimePicker(true);
  }}
  hitSlop={12}
>
  <Text style={styles.timeText}>
    {morningTimeLabel}
  </Text>
</Pressable>

  <Switch
    value={morningEnabled}
    onValueChange={onMorningChange}
  />
</View>

{showMorningTimePicker && (
  <DateTimePicker
    value={
      new Date(
        2000,
        0,
        1,
        morningTime.hour,
        morningTime.minute,
      )
    }
    mode="time"
    onChange={(_, selectedDate) => {
      setShowMorningTimePicker(false);

      if (!selectedDate) {
        return;
      }

      onMorningTimeChange({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      });
    }}
  />
)}

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

  <Pressable
  style={styles.timeButton}
  onPress={() => {
    setShowEveningTimePicker(true);
  }}
  hitSlop={12}
>
  <Text style={styles.timeText}>
    {eveningTimeLabel}
  </Text>
</Pressable>

  <Switch
    value={eveningEnabled}
    onValueChange={onEveningChange}
  />
</View>

{showEveningTimePicker && (
  <DateTimePicker
    value={
      new Date(
        2000,
        0,
        1,
        eveningTime.hour,
        eveningTime.minute,
      )
    }
    mode="time"
    onChange={(_, selectedDate) => {
      setShowEveningTimePicker(false);

      if (!selectedDate) {
        return;
      }

      onEveningTimeChange({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      });
    }}
  />
)}

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

timeButton: {
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 10,
  backgroundColor: Colors.background,
},

timeText: {
  color: Colors.accent,
  fontSize: 15,
  fontWeight: '700',
},
});