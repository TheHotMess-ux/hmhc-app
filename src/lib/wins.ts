export type DailyWin = {
  id: string;
  emoji: string;
  title: string;
};

export function getDailyWins() {
  return [
    {
      id: 'mood',
      emoji: '😊',
      title: 'Checked in with your mood',
    },
    {
      id: 'symptoms',
      emoji: '📝',
      title: 'Logged your symptoms',
    },
    {
      id: 'flow',
      emoji: '🩸',
      title: 'Tracked your cycle',
    },
    {
      id: 'journal',
      emoji: '📖',
      title: 'Journaled today',
    },
    {
      id: 'protein',
      emoji: '🍗',
      title: 'Hit your protein goal',
    },
    {
      id: 'movement',
      emoji: '💪',
      title: 'Moved your body',
    },
    {
      id: 'water',
      emoji: '💧',
      title: 'Stayed hydrated',
    },
    {
      id: 'supplements',
      emoji: '💊',
      title: 'Took your supplements',
    },
    {
      id: 'sleep',
      emoji: '😴',
      title: 'Prioritized sleep',
    },
    {
      id: 'breathing',
      emoji: '🧘',
      title: 'Took a few minutes to breathe',
    },
  ];
}