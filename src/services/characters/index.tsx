import { IApiData } from '../../pages/MainPage';
import { api } from '../api';

export const charactersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCharacters: build.query<IApiData, { page?: string; search?: string }>({
      query: (params) => ({
        url: 'https://swapi.py4e.com/api/people',
        params,
      }),
    }),
  }),
});

export const { useGetCharactersQuery } = charactersApi;
