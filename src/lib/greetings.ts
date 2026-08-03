export type Greeting = {
  emoji: string;
  title: string;
  subtitle: string;
};

const morningGreetings: Greeting[] = [
  {
    emoji: '☀️',
    title: 'Good morning!',
    subtitle:
      "Let's see what your hormones have planned for us today.",
  },
  {
    emoji: '☕',
    title: 'Morning!',
    subtitle:
      'Coffee first. Decisions second.',
  },
  {
    emoji: '🌿',
    title: 'Good morning!',
    subtitle:
      "Your body has been trying to tell you something. Let's listen.",
  },
  {
    emoji: '✨',
    title: 'Morning!',
    subtitle:
      'Be kind to yourself before you try to conquer the world.',
  },
];

const afternoonGreetings: Greeting[] = [
  {
    emoji: '🌿',
    title: 'Good afternoon!',
    subtitle:
      'Hydration check. Protein check. Patience... questionable.',
  },
  {
    emoji: '☀️',
    title: 'Afternoon!',
    subtitle:
      "You're doing better than you think.",
  },
  {
    emoji: '💛',
    title: 'Hello!',
    subtitle:
      'Some days surviving counts as thriving.',
  },
  {
    emoji: '🌼',
    title: 'Afternoon!',
    subtitle:
      'Take a deep breath. Unclench your jaw. Relax your shoulders.',
  },
];

const eveningGreetings: Greeting[] = [
  {
    emoji: '🌙',
    title: 'Good evening!',
    subtitle:
      'You made it through another day. That counts for something.',
  },
  {
    emoji: '✨',
    title: 'Evening!',
    subtitle:
      "Let's check in before tomorrow sneaks up on us.",
  },
  {
    emoji: '🛋️',
    title: 'Welcome back.',
    subtitle:
      'The world can wait five minutes. Your nervous system deserves them.',
  },
  {
    emoji: '💜',
    title: 'Good evening!',
    subtitle:
"Today's check-in is tomorrow's insight.",  },
];

function randomGreeting(
  greetings: Greeting[],
): Greeting {
  return greetings[
    Math.floor(Math.random() * greetings.length)
  ];
}

export function getGreeting(): Greeting {
  const hour = new Date().getHours();

  if (hour < 12) {
    return randomGreeting(morningGreetings);
  }

  if (hour < 17) {
    return randomGreeting(afternoonGreetings);
  }

  return randomGreeting(eveningGreetings);
}