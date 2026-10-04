type AppResetListener = () => void;

const appResetListeners =
  new Set<AppResetListener>();

export function subscribeToAppReset(
  listener: AppResetListener,
): () => void {
  appResetListeners.add(listener);

  return () => {
    appResetListeners.delete(listener);
  };
}

export function requestAppReset(): void {
  appResetListeners.forEach(
    (listener) => listener(),
  );
}
