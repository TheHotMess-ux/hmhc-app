import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import HormoneBattery from '@/components/HormoneBattery';
import { getCyclePhase } from '@/lib/cycle';
import type { FlowLevel } from '@/lib/flow';
import { Colors } from '@/theme/colors';

import InfoRow from '@/components/InfoRow';

import SectionHeading from '@/components/SectionHeading';

import { getDailyReflection } from '@/lib/dailyReflection';


type Entry = {
  mood: string | null;
  symptoms: string[];
  cycleDay: number;
  flow?: FlowLevel | null;
  startsNewPeriod?: boolean;
  endsPeriod?: boolean;
};

type Props = {
  formattedDate: string;
  entry?: Entry;
  onEditPeriod?: () => void;
  onAddLog?: () => void;
  cycleDay?: number | null;
};


export default function SelectedDayCard({
  formattedDate,
  entry,
  cycleDay = null,
  onEditPeriod,
  onAddLog,
}: Props) {

 const phase =
  entry &&
  cycleDay !== null
    ? getCyclePhase(cycleDay)
    : null;

    const reflection =
  entry && phase
    ? getDailyReflection({
        mood: entry.mood,
        symptoms: entry.symptoms,
        flow: entry.flow,
        phaseTitle: phase.title,
      })
    : null;

  return (
    
    <View style={styles.card}>
    <Text style={styles.eyebrow}>DAILY SNAPSHOT</Text>
    <Text style={styles.date}>{formattedDate}</Text>

{reflection && (
  <Text style={styles.dailyReflection}>
    {reflection}
  </Text>
)}

      {entry ? (
        <View style={styles.content}>

        <SectionHeading
          emoji="🌿"
          title="Your Body Today"
/>
          <InfoRow
  emoji="😊"
  label="Mood"
  value={entry.mood ?? 'Not logged'}
/>

<InfoRow
  emoji="🩸"
  label="Flow"
  value={
    entry.flow && entry.flow !== 'None'
      ? entry.flow
      : 'No bleeding logged'
  }
  secondaryValue={
    entry.startsNewPeriod
      ? 'First day of period'
      : entry.endsPeriod
        ? 'Last day of period'
        : undefined
  }
/>

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

<InfoRow
  emoji={phase?.emoji}
  label="Cycle phase"
  value={
    phase?.title ??
    'Not enough cycle data'
  }
  secondaryValue={
    phase && cycleDay !== null
      ? `Day ${cycleDay}`
      : undefined
  }
  accentColor={phase?.color}
/>

{entry && onEditPeriod && (
  <Pressable
    onPress={onEditPeriod}
    style={styles.editButton}>
    <Text style={styles.editButtonText}>
      Edit period log
    </Text>
  </Pressable>
)}

{phase && (
  <View style={styles.hormoneSection}>
    <SectionHeading
      emoji="🧬"
      title="Hormone Snapshot"
/>

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
     <SectionHeading
      emoji="💡"
      title="Understanding Today"
/>

<Text style={styles.subsectionTitle}>
  What This Means
</Text>
      <Text style={styles.bodyText}>
        {phase.description}
      </Text>
    </View>

    <View style={styles.insightSection}>
      <Text style={styles.subsectionTitle}>
  Today&apos;s Focus
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
   <SectionHeading
      emoji="💛"
      title="Gentle Reminder"
/>

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
      Forgot to check in? No problem. Add what you remember.
    </Text>

    {onAddLog && (
      <Pressable
        onPress={onAddLog}
        style={styles.editButton}>
        <Text style={styles.editButtonText}>
          + Add log for this day
        </Text>
      </Pressable>
    )}
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
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

periodStartNote: {
  color: Colors.gold,
  fontSize: 13,
  fontWeight: '700',
},
dailyReflection: {
  color: Colors.textSecondary,
  fontSize: 15,
  fontStyle: 'italic',
  lineHeight: 22,
  marginBottom: 8,
},

subsectionTitle: {
  color: Colors.text,
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 4,
},

editButton: {
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 10,
  backgroundColor: Colors.surfaceLight,
},

editButtonText: {
  color: Colors.gold,
  fontSize: 13,
  fontWeight: '700',
},

});