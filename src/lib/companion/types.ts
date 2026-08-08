export type CompanionTone =
  | 'gentle'
  | 'honest'
  | 'witty'
  | 'feral'
  | 'coach';

export type WhisperCategory =
  | 'general'
  | 'brain-fog'
  | 'fatigue'
  | 'rage'
  | 'adhd'
  | 'gym'
  | 'work'
  | 'relationships'
  | 'sleep'
  | 'confidence'
  | 'body-image'
  | 'period'
  | 'ovulation'
  | 'luteal'
  | 'menstrual';

export interface Whisper {
  id: string;

  body: string;

  tone: CompanionTone;

  category: WhisperCategory;

  tags?: string[];

  weight?: number;
}

export type CompanionNeed =
  | 'kindness'
  | 'laugh'
  | 'encouragement'
  | 'courage'
  | 'rest'
  | 'perspective';