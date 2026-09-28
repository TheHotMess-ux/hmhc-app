export type CaffeineAmount =
  | 'None'
  | '1 drink'
  | '2 drinks'
  | '3 drinks'
  | '4+ drinks';

  export type CaffeineTimeOfDay =
  | 'Morning'
  | 'Afternoon'
  | 'Evening';

export type CaffeineLog = {
  amount: CaffeineAmount;
  lastDrinkTime?: CaffeineTimeOfDay;
};

export const caffeineAmountOptions: {
  amount: CaffeineAmount;
  emoji: string;
  label: string;
}[] = [
  {
    amount: 'None',
    emoji: '🚫',
    label: 'None today',
  },
  {
    amount: '1 drink',
    emoji: '☕',
    label: '1 drink',
  },
  {
    amount: '2 drinks',
    emoji: '☕',
    label: '2 drinks',
  },
  {
    amount: '3 drinks',
    emoji: '☕',
    label: '3 drinks',
  },
  {
    amount: '4+ drinks',
    emoji: '⚡',
    label: '4+ drinks',
  },
];