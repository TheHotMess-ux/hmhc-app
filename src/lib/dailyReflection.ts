import type { FlowLevel } from './flow';

type ReflectionParams = {
  mood?: string | null;
  symptoms?: string[];
  flow?: FlowLevel | null;
  phaseTitle?: string;
};

export function getDailyReflection({
  mood,
  symptoms = [],
  flow,
  phaseTitle,
}: ReflectionParams): string {
  const symptomCount = symptoms.length;

  if (mood?.includes('Feral')) {
    return 'Patience was running on emergency power today. The fact that nobody had to post bail still counts as a win.';
  }

  if (mood?.includes('Running on fumes')) {
    return 'Your battery was blinking red today. Existing was productive enough.';
  }

  if (mood?.includes('Emotionally Weathered')) {
    return 'Your feelings arrived with luggage today. They are allowed to visit, but they do not get to redecorate.';
  }

  if (flow === 'Heavy') {
    return 'Your body was handling heavy machinery today. Lowering expectations was entirely reasonable.';
  }

  if (symptomCount >= 5) {
    return 'Your hormones scheduled a full staff meeting without checking your calendar. Listening was enough.';
  }

  switch (phaseTitle) {
    case 'Menstrual':
      return 'Your body was doing behind-the-scenes work today. Rest was not laziness; it was maintenance.';

    case 'Follicular':
      return 'A little energy may have wandered back into the building. Use it wisely, not as permission to adopt seventeen new projects.';

    case 'Ovulation':
      return 'Confidence may have had the microphone today. Enjoy it before the hormonal committee requests another vote.';

    case 'Luteal':
      return 'Patience may have had limited office hours today. Protecting your peace was a valid scheduling decision.';

    default:
      return 'Another day, another clue. Your body is leaving breadcrumbs, even when the trail looks mildly unhinged.';
  }
}