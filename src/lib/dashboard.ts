type CyclePhase =
  | 'Menstrual'
  | 'Follicular'
  | 'Ovulation'
  | 'Luteal';

type PhaseInsight = {
  phase: CyclePhase;
  summary: string;
  mission: string[];
  encouragement: string;
};
export type SymptomInsight = {
  title: string;
  message: string;
  supportTips: string[];
};

export type DailyEntry = {
  date: string;
  cycleDay: number;
  mood: string | null;
  symptoms: string[];
};

const pepTalks = [
  'You do not need to conquer the entire week today. One useful thing is plenty.',
  'Your hormones may be freelancing, but you are still in charge of the meeting.',
  'Progress counts even when it arrives wearing sweatpants.',
  'You are allowed to move slowly without calling yourself stuck.',
  'Do the next manageable thing. The empire can wait ten minutes.',
];

export function getGreeting(name?: string): string {
  const hour = new Date().getHours();

  let greeting = 'Hello';

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return name ? `${greeting}, ${name}` : greeting;
}

export function getDailyPepTalk(): string {
  const today = new Date();
  const dayNumber = Math.floor(
    today.getTime() / (1000 * 60 * 60 * 24),
  );

  return pepTalks[dayNumber % pepTalks.length];
}

export function getCyclePhase(cycleDay: number): PhaseInsight {
  if (cycleDay >= 1 && cycleDay <= 5) {
    return {
  phase: 'Menstrual',
  summary:
    'Estrogen and progesterone are at lower levels. You may need more rest, warmth, nourishment, and fewer unrealistic expectations.',
  mission: [
    'Prioritize rest',
    'Hydrate',
    'Choose gentle movement',
  ],
  encouragement:
    'Rest is productive. Recovery is part of progress.',
};
  }

  if (cycleDay >= 6 && cycleDay <= 13) {
    return {
      phase: 'Follicular',
      summary:
        'Estrogen is generally rising. Energy, motivation, confidence, and mental clarity may begin to improve.',
      mission: [
        'Start something',
        'Lift or move',
        'Use the extra momentum',
      ],
      encouragement:
  'This is a wonderful time to begin something new.',
    };
  }

  if (cycleDay === 14) {
    return {
      phase: 'Ovulation',
      summary:
        'Estrogen is near its peak and ovulation may be occurring. You may feel more social, energetic, or confident.',
      mission: [
        'Connect',
        'Communicate',
        'Use your strongest energy',
      ],
      encouragement:
  'Lean into your confidence and let yourself take up space.',
    };
  }

  return {
    phase: 'Luteal',
    summary:
      'Progesterone rises and estrogen eventually declines. Energy, patience, appetite, and mood may shift as your period approaches.',
mission: [
  'Protect your energy',
  'Eat enough',
  'Lower the unnecessary pressure',
],
encouragement:
  "Protect your peace before protecting anyone else's expectations.",
};}
export function getSymptomInsight(
  phase: CyclePhase,
  symptoms: string[],
): SymptomInsight | null {
  if (symptoms.length === 0) {
    return null;
  }

  const hasAnySymptom = (options: string[]) =>
    options.some((option) => symptoms.includes(option));

  const temperatureSymptoms = hasAnySymptom([
    'Hot flashes',
    'Night sweats',
  ]);

  const cognitiveSymptoms = hasAnySymptom([
    'Brain fog',
    'Fatigue',
    'Dizziness',
  ]);

  const moodSymptoms = hasAnySymptom([
    'Rage',
    'Anxiety',
  ]);

  const physicalSymptoms = hasAnySymptom([
    'Headache',
    'Joint pain',
    'Bloating',
  ]);

  const appetiteSymptoms = hasAnySymptom([
    'Cravings',
  ]);

  const bleedingSymptoms = hasAnySymptom([
    'Spotting',
  ]);

  if (temperatureSymptoms) {
    return {
      title: 'Your internal thermostat has opinions',
      message:
        'You logged temperature-related symptoms. Hormonal changes can affect temperature regulation, although symptoms can have several possible causes.',
      supportTips: [
        'Keep water nearby',
        'Dress in removable layers',
        'Track when symptoms appear',
      ],
    };
  }

  if (
    phase === 'Luteal' &&
    (moodSymptoms || appetiteSymptoms || cognitiveSymptoms)
  ) {
    return {
      title: 'Your luteal phase may be getting louder',
      message:
        'Mood changes, cravings, fatigue, and brain fog can cluster as a period approaches. Today may call for fewer demands and steadier fuel rather than heroic levels of productivity.',
      supportTips: [
        'Eat regularly',
        'Reduce unnecessary pressure',
        'Choose one manageable priority',
      ],
    };
  }

  if (phase === 'Menstrual' && physicalSymptoms) {
    return {
      title: 'Recovery mode may be appropriate',
      message:
        'You logged physical symptoms during the menstrual phase. Your body may benefit from additional rest, hydration, nourishment, and gentler expectations.',
      supportTips: [
        'Hydrate',
        'Choose comfortable movement',
        'Make room for recovery',
      ],
    };
  }

  if (
    phase === 'Follicular' &&
    (cognitiveSymptoms || moodSymptoms)
  ) {
    return {
      title: 'Your symptoms deserve context',
      message:
        'The follicular phase is often associated with rising energy, but individual experiences vary. Logging symptoms over time can help reveal whether this is an occasional rough day or part of a repeating pattern.',
      supportTips: [
        'Check your sleep',
        'Notice recent stress',
        'Keep tracking the pattern',
      ],
    };
  }

  if (bleedingSymptoms) {
    return {
      title: 'Spotting logged',
      message:
        'Spotting can occur for different reasons. Recording the timing, duration, and any accompanying symptoms can make the information more useful later.',
      supportTips: [
        'Record the amount',
        'Note how long it lasts',
        'Track any related discomfort',
      ],
    };
  }

  if (moodSymptoms) {
    return {
      title: 'Your emotional weather is stormy',
      message:
        'You logged mood-related symptoms. Hormones may be part of the picture, but sleep, stress, nourishment, and life generally being a lot can also contribute.',
      supportTips: [
        'Pause before overcommitting',
        'Eat and hydrate',
        'Lower the emotional workload',
      ],
    };
  }

  if (cognitiveSymptoms) {
    return {
      title: 'Your brain may need fewer tabs open',
      message:
        'Brain fog, fatigue, and dizziness can make ordinary tasks feel heavier. Consider simplifying today and tracking whether these symptoms repeat.',
      supportTips: [
        'Write things down',
        'Focus on one task',
        'Prioritize rest and hydration',
      ],
    };
  }

  if (physicalSymptoms) {
    return {
      title: 'Your body is requesting the microphone',
      message:
        'You logged physical symptoms today. Tracking their timing alongside sleep, stress, movement, and cycle information may help reveal useful patterns.',
      supportTips: [
        'Choose gentle support',
        'Avoid pushing through everything',
        'Track changes over time',
      ],
    };
  }

  return {
    title: `${symptoms.length} ${
      symptoms.length === 1 ? 'symptom' : 'symptoms'
    } logged`,
    message:
      'Your entry has been added to today’s pattern. A single day is information; repeated entries are where the bigger picture begins to emerge.',
    supportTips: [
      'Notice what changes',
      'Keep expectations realistic',
      'Check in again tomorrow',
    ],
  };
}