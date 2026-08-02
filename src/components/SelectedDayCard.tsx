import { StyleSheet, Text, View } from 'react-native';

import HormoneBattery from '@/components/HormoneBattery';
import { getCyclePhase } from '@/lib/cycle';
import { Colors } from '@/theme/colors';

type Entry = {
  mood: string | null;
  symptoms: string[];
  cycleDay: number;
};

type Props = {
  formattedDate: string;
  entry?: Entry;
};

export default function SelectedDayCard({
  formattedDate,
  entry,
}: Props) {
  const phase = entry
    ? getCyclePhase(entry.cycleDay)
    : null;

  return (
    
    <View style={styles.card}>
      <Text style={styles.eyebrow}>SELECTED DAY</Text>

      <Text style={styles.date}>{formattedDate}</Text>

      {entry ? (
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Mood</Text>
            <Text style={styles.value}>
              {entry.mood ?? 'Not logged'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.symptomList}>
  {entry.symptoms.length > 0 ? (
    entry.symptoms.map((symptom) => (
      <Text
        key={symptom}
        style={styles.symptomItem}>
        • {symptom}
      </Text>
    ))
  ) : (
    <Text style={styles.value}>
      None logged
    </Text>
  )}
</View>
          </View>

<View style={styles.row}>
  <Text style={styles.label}>
    TODAY'S CYCLE
  </Text>

  <Text style={styles.value}>
    {phase?.emoji} {phase?.title}
  </Text>

  <Text style={styles.secondaryValue}>
    Day {entry.cycleDay}
  </Text>
</View>

{phase && (
  <View style={styles.hormoneSection}>
    <Text style={styles.label}>
      HORMONE SNAPSHOT
    </Text>

    <View style={styles.hormoneList}>
      <HormoneBattery
        name="Estrogen"
        emoji="🩷"
        status={phase.hormones.estrogen}
        accentColor={phase.color}
      />

      <HormoneBattery
        name="Progesterone"
        emoji="💛"
        status={phase.hormones.progesterone}
        accentColor={phase.color}
      />

      <HormoneBattery
        name="Testosterone"
        emoji="💪"
        status={phase.hormones.testosterone}
        accentColor={phase.color}
      />
    </View>
  </View>
)}

{phase && (
  <>
    <View style={styles.insightSection}>
      <Text style={styles.sectionTitle}>
        💡 WHAT THIS MEANS
      </Text>

      <Text style={styles.bodyText}>
        {phase.description}
      </Text>
    </View>

    <View style={styles.insightSection}>
      <Text style={styles.sectionTitle}>
        🎯 TODAY&apos;S FOCUS
      </Text>

      <View style={styles.recommendationList}>
        {phase.recommendations.map((recommendation) => (
          <Text
            key={recommendation}
            style={styles.recommendationItem}
          >
            • {recommendation}
          </Text>
        ))}
      </View>
    </View>

    <View style={styles.reminderCard}>
      <Text style={styles.sectionTitle}>
        💛 GENTLE REMINDER
      </Text>

      <Text style={styles.reminderText}>
        {phase.encouragement}
      </Text>
    </View>
  </>
)}

        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            Nothing logged for this day
          </Text>

          <Text style={styles.emptyText}>
            No shame. No broken streak. This day is simply
            waiting for information.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },

  eyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

date: {
  color: "#FFFFFF",
  fontSize: 24,
  fontWeight: "800",
  marginBottom: 12,
},

  content: {
    gap: 20,
  },

  row: {
    gap: 4,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

 value: {
  color: "#F4F4F5",
  fontSize: 16,
  lineHeight: 24,
},

  emptyState: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },

emptyTitle: {
  color: '#F4F4F5',
  fontSize: 15,
  fontWeight: '700',
},

emptyText: {
  color: '#C7C7CC',
  fontSize: 14,
  lineHeight: 21,
},

  symptomList: {
  gap:10,
},

symptomItem: {
  color: '#F4F4F5',
  fontSize: 16,
  lineHeight: 24,
},

secondaryValue: {
  color: '#C7C7CC',
  fontSize: 14,
},

insightSection: {
  backgroundColor: Colors.background,
  borderRadius: 16,
  padding: 16,
  gap: 8,
},

sectionTitle: {
  color: Colors.gold,
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 0.8,
},

bodyText: {
  color: '#F4F4F5',
  fontSize: 15,
  lineHeight: 23,
},

recommendationList: {
  gap: 8,
},

recommendationItem: {
  color: '#F4F4F5',
  fontSize: 15,
  lineHeight: 22,
},

reminderCard: {
  backgroundColor: Colors.background,
  borderColor: Colors.gold,
  borderRadius: 16,
  borderWidth: 1,
  padding: 16,
  gap: 8,
},

reminderText: {
  color: '#F4F4F5',
  fontSize: 15,
  fontWeight: '600',
  lineHeight: 23,
},

hormoneSection: {
  gap: 10,
},

hormoneList: {
  gap: 10,
},

});