const handleLocalStorage = (key: string, value: string): string => {
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key) as string;
  } else {
    localStorage.setItem(key, value);
    return value;
  }
};

export default handleLocalStorage;
