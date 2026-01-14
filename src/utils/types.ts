export interface YearlyData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_cement_co2?: number;
  [key: string]: number | string | undefined;
}

export interface CountryData {
  name?: string;
  iso_code?: string;
  data: YearlyData[];
}

export type CO2Data = Record<string, CountryData>;
