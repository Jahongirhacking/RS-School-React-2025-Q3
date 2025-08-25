import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormTypes } from '../../components/Forms/types';

interface FormData {
  id: string;
  source: FormTypes;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  country: string;
  terms: boolean;
  image?: string;
}

const formsSlice = createSlice({
  name: 'forms',
  initialState: {
    data: JSON.parse(localStorage.getItem('data') || '[]') as FormData[],
    countries: [] as string[],
  },
  reducers: {
    addForm: (state, action: PayloadAction<FormData>) => {
      state.data.push(action.payload);
      localStorage.setItem('data', JSON.stringify(state.data));
    },
    setCountries: (state, action: PayloadAction<string[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { addForm, setCountries } = formsSlice.actions;

export default formsSlice.reducer;
