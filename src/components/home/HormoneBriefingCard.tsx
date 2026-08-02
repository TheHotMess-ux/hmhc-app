import { StyleSheet, Text } from 'react-native';

import SectionCard from '../SectionCard';

import { Colors } from '@/theme/colors';


type Props = {
  title: string;
  phase: string;
  description: string;
  encouragement: string;
};

export default function HormoneBriefingCard({
  title,
  phase,
  description,
  encouragement,
}: Props) {
  return (
    <SectionCard title={title}>
      <Text style={styles.phase}>
        {phase}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <Text style={styles.encouragement}>
        {encouragement}
      </Text>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  phase: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  encouragement: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});