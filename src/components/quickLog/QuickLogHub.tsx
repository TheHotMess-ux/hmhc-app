import { useState } from 'react';
import { View } from 'react-native';

import QuickLogCard from '@/components/home/QuickLogCard';
import type { FlowLevel } from '@/lib/flow';

import QuickLogModal from './QuickLogModal';
import type { QuickLogType } from './types';

type Props = {
  selectedMood: string | null;
  selectedSymptoms: string[];
  selectedFlow: FlowLevel | null;
  startsNewPeriod: boolean;

  onMoodSelect: (
    mood: string,
  ) => void | Promise<void>;

  onSymptomsSave: (
    symptoms: string[],
  ) => void | Promise<void>;

  onFlowSave: (
    flow: FlowLevel,
    startsNewPeriod: boolean,
  ) => void | Promise<void>;
};

export default function QuickLogHub({
  selectedMood,
  selectedSymptoms,
  selectedFlow,
  startsNewPeriod,
  onMoodSelect,
  onSymptomsSave,
  onFlowSave,
}: Props) {
  const [activeQuickLog, setActiveQuickLog] =
    useState<QuickLogType>(null);

  return (
    <View>
      <QuickLogCard
        selectedMood={selectedMood}
        selectedSymptoms={selectedSymptoms}
        selectedFlow={null}        
        onMoodPress={() => setActiveQuickLog('mood')}
        onSymptomsPress={() =>
          setActiveQuickLog('symptoms')
        }
        onFlowPress={() => setActiveQuickLog('flow')}
      />

      {activeQuickLog !== null && (
        <QuickLogModal
          visible
          activeLog={activeQuickLog}
          selectedMood={selectedMood}
          selectedSymptoms={selectedSymptoms}
          selectedFlow={selectedFlow}
          startsNewPeriod={startsNewPeriod}
          onMoodSelect={onMoodSelect}
          onSymptomsSave={onSymptomsSave}
          onFlowSave={onFlowSave}
          onClose={() => setActiveQuickLog(null)}
        />
      )}
    </View>
  );
}