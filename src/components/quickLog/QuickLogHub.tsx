import { useState } from 'react';
import { View } from 'react-native';

import QuickLogCard from '@/components/home/QuickLogCard';
import type { FitnessLog } from '@/lib/fitness';
import type {
  FlowDetails,
  FlowLevel,
} from '@/lib/flow';

import type { SleepLog } from '@/lib/sleep';

import type { AlcoholLog } from '@/lib/alcohol';
import type { CaffeineLog } from '@/lib/caffeine';

import type {
  SymptomDetailsMap,
} from '@/lib/symptoms';

import QuickLogModal from './QuickLogModal';
import type { QuickLogType } from './types';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedSymptomDetails?: SymptomDetailsMap;
  selectedSupplements: string[];
  selectedFlow: FlowLevel | null;
  selectedFlowDetails?: FlowDetails;
  startsNewPeriod: boolean;
  endsPeriod: boolean;
  selectedSleep: SleepLog | null;
  showFlow: boolean;
  showCaffeine: boolean;
  showAlcohol: boolean;
  selectedFitness: FitnessLog | null;
  selectedCaffeine: CaffeineLog | null;
  selectedAlcohol: AlcoholLog | null;
  selectedNotes: string;

  onMoodSelect: (
    mood: string,
  ) => void | Promise<void>;

  onSymptomsSave: (
  symptoms: string[],
  symptomDetails: SymptomDetailsMap,
) => void | Promise<void>;

  onSupplementsSave: (
  supplements: string[],
) => void | Promise<void>;

onFlowSave: (
  flow: FlowLevel,
  startsNewPeriod: boolean,
  endsPeriod: boolean,
  flowDetails: FlowDetails,
) => void | Promise<void>;

onSleepSave: (
  sleep: SleepLog,
) => void | Promise<void>;

onFitnessSave: (
  fitness: FitnessLog,
) => void | Promise<void>;

onCaffeineSave: (
  caffeine: CaffeineLog,
) => void | Promise<void>;

onAlcoholSave: (
  alcohol: AlcoholLog,
) => void | Promise<void>;

onNotesSave: (
  notes: string,
) => void | Promise<void>;
};

export default function QuickLogHub({
  selectedMood,
  selectedSymptoms,
  selectedSymptomDetails = {},
  selectedSupplements,
  selectedFlow,
  selectedFlowDetails = {},
  selectedSleep,
  startsNewPeriod,
  endsPeriod,
  showFlow,
  showCaffeine,
  showAlcohol,
  selectedFitness,
  selectedCaffeine,
  selectedAlcohol,
  selectedNotes,
  onMoodSelect,
  onSymptomsSave,
  onSupplementsSave,
  onFlowSave,
  onSleepSave,
  onFitnessSave,
  onCaffeineSave,
  onAlcoholSave,
  onNotesSave,
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
  showCaffeine={showCaffeine}
  showAlcohol={showAlcohol}
  selectedFitness={selectedFitness}
  selectedNotes={selectedNotes}
  selectedCaffeine={selectedCaffeine}
  selectedAlcohol={selectedAlcohol}
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
onCaffeinePress={() =>
  setActiveQuickLog('caffeine')
}
onAlcoholPress={() =>
  setActiveQuickLog('alcohol')
}
  onNotesPress={() =>
    setActiveQuickLog('notes')
  }
/>

      {activeQuickLog !== null && (
  <QuickLogModal
  visible
  activeLog={activeQuickLog}
  selectedMood={selectedMood}
  selectedSymptoms={selectedSymptoms}
   selectedSymptomDetails={
  selectedSymptomDetails
}
  selectedSupplements={
    selectedSupplements
  }
  selectedFlow={selectedFlow}
  selectedFlowDetails={
  selectedFlowDetails
}
  selectedSleep={selectedSleep}
  selectedFitness={selectedFitness}
  selectedCaffeine={selectedCaffeine}
  selectedAlcohol={selectedAlcohol}
  selectedNotes={selectedNotes}
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
  onCaffeineSave={onCaffeineSave}
  onAlcoholSave={onAlcoholSave}
  onNotesSave={onNotesSave}
  onClose={() =>
    setActiveQuickLog(null)
  }
/>
      )}
    </View>
  );
}