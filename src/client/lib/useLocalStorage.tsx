import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) as string)
  );
  useEffect(() => {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
};
