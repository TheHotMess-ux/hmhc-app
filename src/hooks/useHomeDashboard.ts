import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import type { DailyEntry } from '@/lib/dashboard';
import type { FitnessLog } from '@/lib/fitness';
import type { FlowLevel } from '@/lib/flow';
import { loadJournalEntries } from '@/lib/journal';
import type { SleepLog } from '@/lib/sleep';

import {
  prepareDailyQuickLogs,
} from '@/lib/dailyQuickLog';

export function useHomeDashboard() {
  const [selectedMood, setSelectedMood] =
    useState<string | null>(null);

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [selectedFlow, setSelectedFlow] =
    useState<FlowLevel | null>(null);

  const [startsNewPeriod, setStartsNewPeriod] =
    useState(false);

  const [endsPeriod, setEndsPeriod] =
    useState(false); 

  const [selectedSleep, setSelectedSleep] =
    useState<SleepLog | null>(null);

    const [selectedFitness, setSelectedFitness] =
  useState<FitnessLog | null>(null);

  const [journalEntries, setJournalEntries] =
    useState<DailyEntry[]>([]);

  const [isLoadingDashboard, setIsLoadingDashboard] =
    useState(true);

  useFocusEffect(
  useCallback(() => {
    async function loadDashboardData() {

      try {
        await prepareDailyQuickLogs();
 const [
  savedMood,
  savedSymptoms,
  savedFlow,
  savedPeriodStart,
  savedPeriodEnd,
  savedSleep,
  savedFitness,
  savedJournal,
] = await Promise.all([
  AsyncStorage.getItem('todaysMood'),
  AsyncStorage.getItem('todaysSymptoms'),
  AsyncStorage.getItem('todaysFlow'),
  AsyncStorage.getItem('startsNewPeriod'),
  AsyncStorage.getItem('endsPeriod'),
  AsyncStorage.getItem('todaysSleep'),
  AsyncStorage.getItem('todaysFitness'),
  loadJournalEntries(),
]);

        setSelectedMood(savedMood);

        setSelectedSymptoms(
          savedSymptoms
            ? (JSON.parse(savedSymptoms) as string[])
            : [],
        );

        setSelectedFlow(
          savedFlow as FlowLevel | null,
        );

        setStartsNewPeriod(
          savedPeriodStart
            ? (JSON.parse(savedPeriodStart) as boolean)
            : false,
        );

        setEndsPeriod(
          savedPeriodEnd
            ? (JSON.parse(savedPeriodEnd) as boolean)
            : false,
        );

        setSelectedSleep(
          savedSleep
            ? (JSON.parse(savedSleep) as SleepLog)
            : null,
        );

        setSelectedFitness(
  savedFitness
    ? (JSON.parse(savedFitness) as FitnessLog)
    : null,
);

        setJournalEntries(savedJournal);
      } catch (error) {
        console.error(
          'Unable to load Home dashboard data:',
          error,
        );
      } finally {
        setIsLoadingDashboard(false);
      }
    }

       void loadDashboardData();
  }, []),
);

  return {
    selectedMood,
    setSelectedMood,

    selectedSymptoms,
    setSelectedSymptoms,

    selectedFlow,
    setSelectedFlow,

    startsNewPeriod,
    setStartsNewPeriod,

    endsPeriod,
    setEndsPeriod,

    selectedSleep,
    setSelectedSleep,

    selectedFitness,
    setSelectedFitness,

    journalEntries,
    setJournalEntries,

    isLoadingDashboard,
  };
}