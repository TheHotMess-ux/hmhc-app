export type AlcoholAmount =
  | 'None'
  | '1 drink'
  | '2 drinks'
  | '3 drinks'
  | '4+ drinks';

export type AlcoholTimeOfDay =
  | 'Afternoon'
  | 'Evening'
  | 'Late night';

export type AlcoholLog = {
  amount: AlcoholAmount;
  lastDrinkTime?: AlcoholTimeOfDay;
};

export const alcoholAmountOptions: {
  amount: AlcoholAmount;
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
    emoji: '🍷',
    label: '1 drink',
  },
  {
    amount: '2 drinks',
    emoji: '🍷',
    label: '2 drinks',
  },
  {
    amount: '3 drinks',
    emoji: '🍷',
    label: '3 drinks',
  },
  {
    amount: '4+ drinks',
    emoji: '🥂',
    label: '4+ drinks',
  },
];