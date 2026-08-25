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

import type { SleepLog } from '@/lib/sleep';

type Entry = {
  mood: string | null;
  symptoms: string[];
  supplements?: string[];
  sleep?: SleepLog;
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
  showCycleTracking?: boolean;
  onClearLog?: () => void;
};


export default function SelectedDayCard({
  formattedDate,
  entry,
  cycleDay = null,
  showCycleTracking = true,
  onEditPeriod,
  onAddLog,
  onClearLog,

}: Props) {

 const phase =
  showCycleTracking &&
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

{showCycleTracking && (
  <InfoRow
    emoji="🩸"
    label="Flow"
    value={
      entry.flow &&
      entry.flow !== 'None'
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
)}

<View style={styles.row}>
  <Text style={styles.label}>
    Symptoms
  </Text>

  {entry.symptoms.length > 0 ? (
    <View style={styles.symptomList}>
      {entry.symptoms.map(
        (symptom) => (
          <View
            key={symptom}
            style={styles.symptomChip}>
            <Text
              style={
                styles.symptomChipText
              }>
              {symptom}
            </Text>
          </View>
        ),
      )}
    </View>
  ) : (
    <Text style={styles.value}>
      None logged
    </Text>
  )}
</View>

<View style={styles.row}>
  <Text style={styles.label}>
    Supplements
  </Text>

  {entry.supplements?.length ? (
    <View style={styles.symptomList}>
      {entry.supplements.map(
        (supplement) => (
          <View
            key={supplement}
            style={styles.symptomChip}>
            <Text
              style={
                styles.symptomChipText
              }>
              {supplement}
            </Text>
          </View>
        ),
      )}
    </View>
  ) : (
    <Text style={styles.value}>
      None logged
    </Text>
  )}
</View>

<InfoRow
  emoji="😴"
  label="Sleep"
  value={
    entry.sleep
      ? `${entry.sleep.quality} · ${entry.sleep.duration}`
      : 'Not logged'
  }
  secondaryValue={
    entry.sleep
      ? [
          entry.sleep.wokeFrequently
            ? 'Frequent waking'
            : '',
          entry.sleep.nightSweats
            ? 'Night sweats'
            : '',
        ]
          .filter(Boolean)
          .join(' · ') || undefined
      : undefined
  }
/>

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

<View style={styles.editActions}>
  {showCycleTracking &&
    entry &&
    onEditPeriod && (
      <Pressable
        onPress={onEditPeriod}
        style={styles.editButton}>
        <Text style={styles.editButtonText}>
          Edit period log
        </Text>
      </Pressable>
  )}

  {onAddLog && (
    <Pressable
      onPress={onAddLog}
      style={styles.editButton}>
      <Text style={styles.editButtonText}>
        Edit daily log
      </Text>
    </Pressable>
  )}
</View>

{onClearLog && (
  <Pressable
    onPress={onClearLog}
    style={styles.clearButton}>
    <Text style={styles.clearButtonText}>
      Clear this day&apos;s logs
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

  <View style={styles.insightDivider} />

  <Text style={styles.subsectionTitle}>
    Today&apos;s Focus
  </Text>

  <View style={styles.recommendationList}>
    {phase.recommendations.map(
      (recommendation) => (
        <Text
          key={recommendation}
          style={styles.recommendationItem}>
          • {recommendation}
        </Text>
      ),
    )}
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
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},

symptomChip: {
  backgroundColor: Colors.surfaceLight,
  borderColor: Colors.border,
  borderRadius: 999,
  borderWidth: 1,
  paddingHorizontal: 11,
  paddingVertical: 7,
},

symptomChipText: {
  color: '#F4F4F5',
  fontSize: 13,
  fontWeight: '600',
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

insightDivider: {
  height: 1,
  backgroundColor: Colors.border,
  marginVertical: 6,
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

clearButton: {
  alignSelf: 'flex-start',
  paddingHorizontal: 4,
  paddingVertical: 8,
},

clearButtonText: {
  color: '#FF8A8A',
  fontSize: 13,
  fontWeight: '600',
},

editActions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},

});