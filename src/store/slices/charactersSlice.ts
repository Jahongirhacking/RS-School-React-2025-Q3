import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IPerson from '../../types/IPerson';
import localStorageKeys from '../../utils/localStorageKeys';

export interface ICharactersState {
  selected: IPerson[];
}

const initialState: ICharactersState = {
  selected:
    JSON.parse(localStorage.getItem(localStorageKeys.searchedList) || '[]') ||
    [],
};

const charactersSlice = createSlice({
  name: 'charactersSlice',
  initialState,
  reducers: {
    handleSelectPerson: (state, action: PayloadAction<IPerson>) => {
      const url = action.payload?.url;
      if (state.selected.find((person) => person?.url === url)) {
        state.selected = state.selected.filter((person) => person?.url !== url);
      } else {
        state.selected.push(action.payload);
      }
      localStorage.setItem(
        localStorageKeys.searchedList,
        JSON.stringify(state.selected)
      );
    },

    unselectAll: (state) => {
      state.selected = [];
      localStorage.removeItem(localStorageKeys.searchedList);
    },
  },
});

export const { handleSelectPerson, unselectAll } = charactersSlice.actions;

export default charactersSlice.reducer;
