const symptomWeights: Record<string, number> = {
  'Brain fog': 2,
  'Fatigue': 3,
  'Hot flashes': 1,
  'Night sweats': 2,
  'Anxiety': 2,
  'Rage': 3,
  'Spotting': 1,
  'Cravings': 1,
  'Headache': 2,
  'Joint pain': 2,
  'Bloating': 1,
  'Dizziness': 2,
};

export function calculateBodyLoad(
  symptoms: string[],
): number {
  return symptoms.reduce((total, symptom) => {
    return (
      total +
      (symptomWeights[symptom] ?? 1)
    );
  }, 0);
}