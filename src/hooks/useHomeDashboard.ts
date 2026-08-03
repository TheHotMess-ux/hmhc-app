import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import type { DailyEntry } from '@/lib/dashboard';
import type { FlowLevel } from '@/lib/flow';
import { loadJournalEntries } from '@/lib/journal';

export function useHomeDashboard() {
  const [selectedMood, setSelectedMood] =
    useState<string | null>(null);

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [selectedFlow, setSelectedFlow] =
    useState<FlowLevel | null>(null);

  const [startsNewPeriod, setStartsNewPeriod] =
    useState(false);

  const [journalEntries, setJournalEntries] =
    useState<DailyEntry[]>([]);

  const [isLoadingDashboard, setIsLoadingDashboard] =
    useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          savedMood,
          savedSymptoms,
          savedFlow,
          savedPeriodStart,
          savedJournal,
        ] = await Promise.all([
          AsyncStorage.getItem('todaysMood'),
          AsyncStorage.getItem('todaysSymptoms'),
          AsyncStorage.getItem('todaysFlow'),
          AsyncStorage.getItem('startsNewPeriod'),
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
  }, []);

  return {
    selectedMood,
    setSelectedMood,

    selectedSymptoms,
    setSelectedSymptoms,

    selectedFlow,
    setSelectedFlow,

    startsNewPeriod,
    setStartsNewPeriod,

    journalEntries,
    setJournalEntries,

    isLoadingDashboard,
  };
}