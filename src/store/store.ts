// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import charactersReducer from './slices/charactersSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Types for later use
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
