export type PeriodReminderMessage = {
  title: string;
  body: string;
};

const periodReminderMessages: PeriodReminderMessage[] = [
  {
    title: '🩸 Your period may be approaching',
    body:
      'Your predicted window is here. If your period starts, log it so I can keep learning your rhythm.',
  },
  {
    title: '🔮 Hormonal weather watch',
    body:
      'Your period may be lurking nearby. If it shows up, log it so I can keep your predictions updated.',
  },
  {
    title: '🩸 Possible incoming',
    body:
      'You’ve reached your predicted period window. If your cycle starts, give me a quick heads-up.',
  },
  {
    title: '✨ Your rhythm check-in',
    body:
      'Your estimated period window has arrived. If bleeding starts, log it and I’ll take care of the cycle math.',
  },
  {
    title: '🩸 Period watch: activated',
    body:
      'Your period may be approaching. If it arrives, log the start so I can keep learning what your cycle is doing.',
  },
];

export function getPeriodReminderMessage(
  index: number = 0,
): PeriodReminderMessage {
  const safeIndex =
    Math.abs(index) %
    periodReminderMessages.length;

  return periodReminderMessages[safeIndex];
}