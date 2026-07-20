import { StyleSheet, Text } from 'react-native';

import { Colors } from '@/theme/colors';

import SectionCard from '../SectionCard';

type Props = {
  pepTalk: string;
};

export default function FeralForecastCard({
  pepTalk,
}: Props) {
  return (
    <SectionCard title="Feral Forecast">
      <Text style={styles.pepTalk}>
        {pepTalk}
      </Text>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  pepTalk: {
    color: Colors.textPrimary,
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
  },
});