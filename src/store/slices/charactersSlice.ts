import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IPerson from '../../types/IPerson';
import localStorageKeys from '../../utils/localStorageKeys';

export interface ICharactersState {
  selected: IPerson[];
  searched: string;
}

const initialState: ICharactersState = {
  selected: [],
  searched: '',
};

const charactersSlice = createSlice({
  name: 'charactersSlice',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<IPerson[]>) => {
      state.selected = action.payload;
    },

    setSearched: (state, action: PayloadAction<string>) => {
      state.searched = action.payload;
    },

    handleSelectPerson: (state, action: PayloadAction<IPerson>) => {
      const url = action.payload?.url;
      if (state.selected.find((person) => person?.url === url)) {
        state.selected = state.selected.filter((person) => person?.url !== url);
      } else {
        state.selected.push(action.payload);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          localStorageKeys.searchedList,
          JSON.stringify(state.selected)
        );
      }
    },

    unselectAll: (state) => {
      state.selected = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(localStorageKeys.searchedList);
      }
    },
  },
});

export const { handleSelectPerson, unselectAll, setSelected, setSearched } =
  charactersSlice.actions;

export default charactersSlice.reducer;
