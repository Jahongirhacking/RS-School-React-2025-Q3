import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SortBy = 'pop_desc' | 'pop_asc' | 'name_asc' | 'name_desc';

interface UIState {
  selectedYear: number | null;
  regionFilter: string;
  search: string;
  sortBy: SortBy;
  cols: { column: string; visible: boolean }[];
}

const initialState: UIState = {
  selectedYear: null,
  regionFilter: 'All regions',
  search: '',
  sortBy: 'name_asc',
  cols: [
    { column: 'year', visible: true },
    { column: 'population', visible: true },
    { column: 'cement_co2', visible: true },
    { column: 'cumulative_cement_co2', visible: true },
    { column: 'cement_co2_per_capita', visible: false },
    { column: 'cumulative_co2_including_luc', visible: false },
    { column: 'cumulative_oil_co2', visible: false },
    { column: 'cumulative_gas_co2', visible: false },
    { column: 'energy_per_capita', visible: false },
    { column: 'ghg_excluding_lucf_per_capita', visible: false },
  ],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedYear(state, action: PayloadAction<number>) {
      state.selectedYear = action.payload;
    },
    setRegionFilter(state, action: PayloadAction<string>) {
      state.regionFilter = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },
    setExtraCols(state, action: PayloadAction<string>) {
      const elem = state.cols.find((c) => c?.column === action.payload);
      if (!elem) return state;
      elem.visible = !elem.visible;
    },
  },
});

export const {
  setSelectedYear,
  setRegionFilter,
  setSearch,
  setSortBy,
  setExtraCols,
} = uiSlice.actions;
export default uiSlice.reducer;
