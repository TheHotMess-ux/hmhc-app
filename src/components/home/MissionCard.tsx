import { StyleSheet, Text } from 'react-native';

import { Colors } from '@/theme/colors';

import SectionCard from '../SectionCard';

type Props = {
  mission: string[];
};

export default function MissionCard({
  mission,
}: Props) {
  return (
    <SectionCard title="Today's Mission">
      {mission.map((item) => (
        <Text
          key={item}
          style={styles.item}>
          ✓ {item}
        </Text>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  item: {
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});