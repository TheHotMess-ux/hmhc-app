import { useState } from 'react';
import { View } from 'react-native';

import QuickLogCard from '@/components/home/QuickLogCard';
import type { FitnessLog } from '@/lib/fitness';
import type { FlowLevel } from '@/lib/flow';
import type { SleepLog } from '@/lib/sleep';

import QuickLogModal from './QuickLogModal';
import type { QuickLogType } from './types';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedSupplements: string[];
  selectedFlow: FlowLevel | null;
  startsNewPeriod: boolean;
  endsPeriod: boolean;
  selectedSleep: SleepLog | null;
  showFlow: boolean;
  selectedFitness: FitnessLog | null;

  onMoodSelect: (
    mood: string,
  ) => void | Promise<void>;

  onSymptomsSave: (
    symptoms: string[],
  ) => void | Promise<void>;

  onSupplementsSave: (
  supplements: string[],
) => void | Promise<void>;

  onFlowSave: (
  flow: FlowLevel,
  startsNewPeriod: boolean,
  endsPeriod: boolean,
) => void | Promise<void>;

onSleepSave: (
  sleep: SleepLog,
) => void | Promise<void>;

onFitnessSave: (
  fitness: FitnessLog,
) => void | Promise<void>;
};

export default function QuickLogHub({
  selectedMood,
  selectedSymptoms,
  selectedSupplements,
  selectedFlow,
  selectedSleep,
  startsNewPeriod,
  endsPeriod,
  showFlow,
  selectedFitness,
  onMoodSelect,
  onSymptomsSave,
  onSupplementsSave,
  onFlowSave,
  onSleepSave,
  onFitnessSave,
}: Props) {

  const [activeQuickLog, setActiveQuickLog] =
    useState<QuickLogType>(null);

  return (
    <View>
<QuickLogCard
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
  selectedSupplements={selectedSupplements}
  selectedFlow={selectedFlow}
  selectedSleep={selectedSleep}
  showFlow={showFlow}
  selectedFitness={selectedFitness}
  onMoodPress={() => setActiveQuickLog('mood')}
  onSymptomsPress={() =>
    setActiveQuickLog('symptoms')
  }
  onSupplementsPress={() =>
    setActiveQuickLog('supplements')
  }
  onFlowPress={() =>
    setActiveQuickLog('flow')
  }
  onSleepPress={() =>
    setActiveQuickLog('sleep')
  }
  onFitnessPress={() =>
  setActiveQuickLog('fitness')
}
/>

      {activeQuickLog !== null && (
  <QuickLogModal
  visible
  activeLog={activeQuickLog}
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
  selectedSupplements={
    selectedSupplements
  }
  selectedFlow={selectedFlow}
  selectedSleep={selectedSleep}
  selectedFitness={selectedFitness}
  startsNewPeriod={startsNewPeriod}
  endsPeriod={endsPeriod}
  onMoodSelect={onMoodSelect}
  onSymptomsSave={onSymptomsSave}
  onSupplementsSave={
    onSupplementsSave
  }
  onFlowSave={onFlowSave}
  onSleepSave={onSleepSave}
  onFitnessSave={onFitnessSave}
  onClose={() =>
    setActiveQuickLog(null)
  }
/>
      )}
    </View>
  );
}