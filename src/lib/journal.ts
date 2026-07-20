import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyEntry } from './dashboard';

const JOURNAL_STORAGE_KEY = 'hmhcJournalEntries';

export async function loadJournalEntries(): Promise<DailyEntry[]> {
  try {
    const savedEntries = await AsyncStorage.getItem(
      JOURNAL_STORAGE_KEY,
    );

    if (savedEntries === null) {
      return [];
    }

    return JSON.parse(savedEntries) as DailyEntry[];
  } catch (error) {
    console.error('Unable to load journal entries:', error);
    return [];
  }
}

export async function saveJournalEntry(
  entry: DailyEntry,
): Promise<DailyEntry[]> {
  try {
    const currentEntries = await loadJournalEntries();

    const entryAlreadyExists = currentEntries.some(
      (savedEntry) => savedEntry.date === entry.date,
    );

    const updatedEntries = entryAlreadyExists
      ? currentEntries.map((savedEntry) =>
          savedEntry.date === entry.date ? entry : savedEntry,
        )
      : [entry, ...currentEntries];

    await AsyncStorage.setItem(
      JOURNAL_STORAGE_KEY,
      JSON.stringify(updatedEntries),
    );

    return updatedEntries;
  } catch (error) {
    console.error('Unable to save journal entry:', error);
    return [];
  }
}