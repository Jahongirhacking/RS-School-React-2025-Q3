import { createContext } from 'react';
import { IApiData } from './MainPage';

export interface MainProps {
  apiData: IApiData;
  searched: string;
}

export const MainContext = createContext<MainProps | null>(null);
