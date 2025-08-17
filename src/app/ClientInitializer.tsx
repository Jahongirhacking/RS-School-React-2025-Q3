'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearched, setSelected } from '../store/slices/charactersSlice';
import localStorageKeys from '../utils/localStorageKeys';

export default function ClientInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const parseSafely = (key: string) => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        // If it’s not JSON, just return as plain string
        return raw;
      }
    };

    const selected = parseSafely(localStorageKeys.searchedList) || '';
    const searched = parseSafely(localStorageKeys.searched) || '';

    if (selected) {
      dispatch(setSelected(selected));
    }
    if (searched) {
      dispatch(setSearched(searched));
    }
  }, [dispatch]);

  return null;
}
