import { StyleSheet, Text } from 'react-native';

import { Colors } from '@/theme/colors';

import SectionCard from '../SectionCard';

type Props = {
  title: string;
  message: string;
  supportTips: string[];
};

export default function PersonalizedInsightCard({
  title,
  message,
  supportTips,
}: Props) {
  return (
    <SectionCard title="Personalized Insight">
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.body}>
        {message}
      </Text>

      {supportTips.map((tip) => (
        <Text
          key={tip}
          style={styles.body}>
          • {tip}
        </Text>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  body: {
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});