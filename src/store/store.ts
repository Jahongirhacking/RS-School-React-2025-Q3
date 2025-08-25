import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import formReducer from './slices/formSlice';

export const store = configureStore({
  reducer: {
    formReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;

setupListeners(store.dispatch);
