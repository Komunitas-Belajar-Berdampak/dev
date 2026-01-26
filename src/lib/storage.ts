const storage = typeof window !== 'undefined' ? window.localStorage : null;

export const getLocalStorage = <T>(key: string): T | null => {
  if (!storage) return null;

  const item = storage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item) as T;
  } catch {
    return item as unknown as T;
  }
};

export const setLocalStorage = (key: string, value: unknown) => {
  if (!storage) return;
  if (typeof value === 'string') {
    storage.setItem(key, value);
  } else {
    storage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key: string) => {
  if (!storage) return;
  storage.removeItem(key);
};
