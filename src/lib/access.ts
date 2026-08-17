export type AccessMode =
  | 'free'
  | 'premium'
  | 'beta';

export type PremiumFeature =
  | 'doctorReport'
  | 'doctorReportPdf'
  | 'advancedPatterns';

export const accessConfig: {
  mode: AccessMode;
} = {
  mode: 'beta',
};

export function getAccessMode(): AccessMode {
  return accessConfig.mode;
}

export function hasPremiumAccess(): boolean {
  const accessMode =
    getAccessMode();

  return (
    accessMode === 'premium' ||
    accessMode === 'beta'
  );
}

export function canAccessPremiumFeature(
  _feature: PremiumFeature,
): boolean {
  return hasPremiumAccess();
}

export function isBetaAccess(): boolean {
  return getAccessMode() === 'beta';
}