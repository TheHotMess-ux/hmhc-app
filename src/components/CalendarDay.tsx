import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';

type Props = {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  hasEntry: boolean;
  phaseColor?: string;
  moodEmoji?: string;
  bodyLoadColor?: string;
  onPress: () => void;
};

export default function CalendarDay({
  day,
  isToday,
  isSelected,
  hasEntry,
  phaseColor,
  moodEmoji,
  onPress,
  bodyLoadColor,
}: Props) {

  return (
    <View style={styles.dayCell}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
    style={({ pressed }) => [
  styles.dayButton,
  phaseColor && {
    backgroundColor: phaseColor,
  },
  isToday && styles.todayButton,
  isSelected && styles.selectedButton,
  pressed && styles.pressed,
]}>
        <Text
          style={[
            styles.dayNumber,
            isSelected && styles.selectedDayNumber,
          ]}>
          {day}
        </Text>

<View style={styles.statusRow}>
  {moodEmoji && (
    <Text style={styles.moodEmoji}>
      {moodEmoji}
    </Text>
  )}

  {bodyLoadColor && (
    <View
      style={[
        styles.bodyLoadDot,
        { backgroundColor: bodyLoadColor },
      ]}
    />
  )}

  {hasEntry && <View style={styles.dot} />}
</View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },

  dayButton: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

 todayButton: {
  borderWidth: 2,
  borderColor: Colors.gold,

  shadowColor: Colors.gold,
  shadowOpacity: 0.25,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 5,
},

 selectedButton: {
  backgroundColor: Colors.gold,
  borderRadius: 18,
  transform: [{ scale: 1.04 }],
},

  dayNumber: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  selectedDayNumber: {
    color: Colors.background,
    fontWeight: '800',
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.textPrimary,
  },

  pressed: {
    opacity: 0.7,
  },

  moodEmoji: {
  fontSize: 13,
  lineHeight: 15,
},

bodyLoadDot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  marginTop: 2,
},

});