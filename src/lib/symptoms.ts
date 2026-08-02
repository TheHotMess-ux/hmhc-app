export type Symptom = {
  id: string;
  label: string;
  emoji: string;
};

export type SymptomCategory = {
  id: string;
  title: string;
  emoji: string;
  symptoms: Symptom[];
};

export const symptomCategories: SymptomCategory[] = [
  {
    id: 'brain',
    title: 'Brain & Focus',
    emoji: '🧠',
    symptoms: [
      {
        id: 'brainFog',
        label: 'Brain Fog',
        emoji: '🧠',
      },
      {
        id: 'forgettingWords',
        label: 'Forgetting Words',
        emoji: '😵',
      },
      {
        id: 'forgetfulness',
        label: 'Forgetfulness',
        emoji: '🫠',
      },
      {
        id: 'adhdOverload',
        label: 'ADHD Overload',
        emoji: '⚡',
      },
      {
        id: 'overstimulated',
        label: 'Overstimulated',
        emoji: '🤯',
      },
      {
        id: 'difficultyConcentrating',
        label: 'Difficulty Concentrating',
        emoji: '🎯',
      },
      {
        id: 'headache',
        label: 'Headache',
        emoji: '💥',
      },
      {
        id: 'dizziness',
        label: 'Dizziness',
        emoji: '🌀',
      },
    ],
  },

  {
    id: 'mood',
    title: 'Mood',
    emoji: '❤️',
    symptoms: [
      {
        id: 'anxiety',
        label: 'Anxiety',
        emoji: '🫨',
      },
      {
        id: 'irritability',
        label: 'Irritability',
        emoji: '😤',
      },
      {
        id: 'rage',
        label: 'Rage',
        emoji: '💢',
      },
      {
        id: 'lowMood',
        label: 'Low Mood',
        emoji: '🌧️',
      },
      {
        id: 'emotional',
        label: 'Emotional',
        emoji: '🥹',
      },
      {
        id: 'cryingEasily',
        label: 'Crying Easily',
        emoji: '😭',
      },
      {
        id: 'feelingOverwhelmed',
        label: 'Feeling Overwhelmed',
        emoji: '🌪️',
      },
      {
        id: 'lowMotivation',
        label: 'Low Motivation',
        emoji: '🪫',
      },
    ],
  },

  {
    id: 'body',
    title: 'Body',
    emoji: '🌡️',
    symptoms: [
      {
        id: 'hotFlashes',
        label: 'Hot Flashes',
        emoji: '🥵',
      },
      {
        id: 'nightSweats',
        label: 'Night Sweats',
        emoji: '💦',
      },
      {
        id: 'fatigue',
        label: 'Fatigue',
        emoji: '😴',
      },
      {
        id: 'jointPain',
        label: 'Joint Pain',
        emoji: '🦴',
      },
      {
        id: 'muscleAches',
        label: 'Muscle Aches',
        emoji: '💪',
      },
      {
        id: 'bloating',
        label: 'Bloating',
        emoji: '🎈',
      },
      {
        id: 'breastTenderness',
        label: 'Breast Tenderness',
        emoji: '💗',
      },
      {
        id: 'heartPalpitations',
        label: 'Heart Palpitations',
        emoji: '❤️‍🔥',
      },
    ],
  },

  {
    id: 'sleep',
    title: 'Rest & Sleep',
    emoji: '🌙',
    symptoms: [
      {
        id: 'troubleFallingAsleep',
        label: 'Trouble Falling Asleep',
        emoji: '🛏️',
      },
      {
        id: 'restlessSleep',
        label: 'Restless Sleep',
        emoji: '🌀',
      },
      {
        id: 'wakingDuringNight',
        label: 'Waking During the Night',
        emoji: '🌃',
      },
      {
        id: 'earlyWaking',
        label: 'Early Waking',
        emoji: '🌅',
      },
      {
        id: 'unrefreshingSleep',
        label: 'Unrefreshing Sleep',
        emoji: '🥱',
      },
    ],
  },

  {
    id: 'cycle',
    title: 'Cycle',
    emoji: '🩸',
    symptoms: [
      {
        id: 'cramps',
        label: 'Cramps',
        emoji: '⚡',
      },
      {
        id: 'spotting',
        label: 'Spotting',
        emoji: '🌸',
      },
      {
        id: 'pelvicPressure',
        label: 'Pelvic Pressure',
        emoji: '⬇️',
      },
      {
        id: 'longerPeriod',
        label: 'Longer Period',
        emoji: '📆',
      },
      {
        id: 'shorterPeriod',
        label: 'Shorter Period',
        emoji: '⏱️',
      },
      {
        id: 'irregularBleeding',
        label: 'Irregular Bleeding',
        emoji: '🎭',
      },
    ],
  },

  {
    id: 'digestion',
    title: 'Digestion',
    emoji: '🫧',
    symptoms: [
      {
        id: 'constipation',
        label: 'Constipation',
        emoji: '🧱',
      },
      {
        id: 'diarrhea',
        label: 'Diarrhea',
        emoji: '💨',
      },
      {
        id: 'nausea',
        label: 'Nausea',
        emoji: '🤢',
      },
      {
        id: 'foodCravings',
        label: 'Food Cravings',
        emoji: '🍫',
      },
      {
        id: 'appetiteChanges',
        label: 'Changes in Appetite',
        emoji: '🍽️',
      },
      {
        id: 'indigestion',
        label: 'Indigestion',
        emoji: '🔥',
      },
    ],
  },
];