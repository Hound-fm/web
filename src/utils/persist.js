export const persistState = (storageKey, state) => {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const getIntialState = (storageKey) => {
  const savedState = window.localStorage.getItem(storageKey);
  console.info(savedState);
  try {
    if (!savedState) {
      return undefined;
    }
    const parsed = JSON.parse(savedState);
    document.documentElement.dataset.theme = parsed.theme;

    return parsed;
  } catch (e) {
    console.error("Error loading state : " + storageKey);
    return undefined;
  }
};
