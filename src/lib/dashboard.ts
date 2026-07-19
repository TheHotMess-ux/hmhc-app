type CyclePhase =
  | 'Menstrual'
  | 'Follicular'
  | 'Ovulation'
  | 'Luteal';

type PhaseInsight = {
  phase: CyclePhase;
  summary: string;
  mission: string[];
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
  };
}