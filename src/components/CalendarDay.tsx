import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { FlowLevel } from '@/lib/flow';
import { Colors } from '@/theme/colors';

type Props = {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  hasEntry: boolean;
  phaseColor?: string;
  moodEmoji?: string;
  bodyLoadColor?: string;
  flow?: FlowLevel | null;
  startsNewPeriod?: boolean;
  endsPeriod?: boolean;
  isPredictedPeriodWindow?: boolean;
  isPredictedPeriodDate?: boolean;
  onPress: () => void;
};

export default function CalendarDay({
  day,
  isToday,
  isSelected,
  hasEntry,
  phaseColor,
  moodEmoji,
  bodyLoadColor,
  flow,
  startsNewPeriod = false,
  endsPeriod = false,
  isPredictedPeriodWindow = false,
  isPredictedPeriodDate = false,
  onPress,
}: Props) {

  const hasBleeding =
    flow &&
    flow !== 'None';

  function getFlowMarkerWidth(): number {
    switch (flow) {
      case 'Heavy':
        return 22;

      case 'Moderate':
        return 16;

      case 'Light':
        return 10;

      case 'Spotting':
        return 5;

      default:
        return 0;
    }
  }

  return (
    <View style={styles.dayCell}>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Select day ${day}`}
        accessibilityState={{
          selected: isSelected,
        }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.dayButton,

          phaseColor && {
            backgroundColor: phaseColor,
          },

          startsNewPeriod &&
            styles.periodStartButton,

          isToday &&
            styles.todayButton,

          isPredictedPeriodWindow &&
            styles.predictedWindowButton,

          isPredictedPeriodDate &&
            styles.predictedDateButton,

          isSelected &&
            styles.selectedButton,

          pressed &&
            styles.pressed,
        ]}>
        <Text
          style={[
            styles.dayNumber,
            isSelected &&
              styles.selectedDayNumber,
          ]}>
          {day}
        </Text>

        {isPredictedPeriodDate && (
  <Text style={styles.predictedPeriodMarker}>
    🩸
  </Text>
)}

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
                {
                  backgroundColor:
                    bodyLoadColor,
                },
              ]}
            />
          )}

          {hasEntry && !moodEmoji && (
            <View style={styles.entryDot} />
          )}
        </View>

{hasBleeding && (
  <View
    style={[
      styles.flowMarker,
      {
        width: getFlowMarkerWidth(),
      },
      flow === 'Spotting' &&
        styles.spottingMarker,
    ]}
  />
)}

{endsPeriod && (
  <View style={styles.periodEndMarker}>
    <Text style={styles.periodEndText}>
      END
    </Text>
  </View>
)}
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
    gap: 3,
    position: 'relative',
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

  periodStartButton: {
    borderWidth: 1,
    borderColor: Colors.gold,
  },

  selectedButton: {
    backgroundColor: Colors.gold,
    borderRadius: 18,
    transform: [{ scale: 1.04 }],
  },

  dayNumber: {
    color: Colors.text,
    fontWeight: '600',
  },

  selectedDayNumber: {
    color: Colors.background,
    fontWeight: '800',
  },

  statusRow: {
    minHeight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  entryDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
  },

  moodEmoji: {
    fontSize: 13,
    lineHeight: 15,
  },

  bodyLoadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  flowMarker: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.danger,
  },

  spottingMarker: {
    height: 5,
    borderRadius: 3,
  },

  pressed: {
    opacity: 0.7,
  },

  periodEndMarker: {
  marginTop: 2,
  paddingHorizontal: 5,
  paddingVertical: 1,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: Colors.gold,
},

periodEndText: {
  color: Colors.gold,
  fontSize: 7,
  fontWeight: '800',
  letterSpacing: 0.5,
},

predictedWindowButton: {
  borderWidth: 1,
  borderColor: Colors.goldLight,
},

predictedDateButton: {
  borderWidth: 2,
  borderColor: Colors.gold,
},

predictedPeriodMarker: {
  position: 'absolute',
  top: 6,
  right: 6,
  fontSize: 11,
},

});