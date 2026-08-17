import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme/colors';

type Props = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

export default function CalendarHeader({
  monthLabel,
  onPrevious,
  onNext,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevious}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.arrow}>‹</Text>
      </Pressable>

      <Text style={styles.title}>
        {monthLabel}
      </Text>

      <Pressable
        onPress={onNext}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  arrow: {
    color: Colors.text,
    fontSize: 28,
  },

  title: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 20,
  },

  pressed: {
    opacity: 0.7,
  },
});