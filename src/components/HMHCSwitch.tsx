import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Colors } from '@/theme/colors';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

export default function HMHCSwitch({
  value,
  onValueChange,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{
        checked: value,
      }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.track,
          value && styles.trackSelected,
        ]}>
        <View
          style={[
            styles.thumb,
            value && styles.thumbSelected,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flexShrink: 0,
  },

  track: {
    width: 48,
    height: 28,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    justifyContent: 'center',
  },

  trackSelected: {
    borderColor: Colors.accent,
  },

  thumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.textSecondary,
    borderRadius: 10,
  },

  thumbSelected: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
  },

  pressed: {
    opacity: 0.7,
  },
});
