import { createContext } from 'react';
import { IApiData } from '../app/page';

export interface MainProps {
  charactersData?: IApiData;
  searched: string;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const MainContext = createContext<MainProps | null>(null);
