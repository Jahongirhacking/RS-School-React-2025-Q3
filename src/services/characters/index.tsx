import { IApiData } from '../../pages/MainPage';
import IPerson from '../../types/IPerson';
import { api } from '../api';

export const charactersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCharacters: build.query<IApiData, { page?: string; search?: string }>({
      query: (params) => ({
        url: 'https://swapi.py4e.com/api/people',
        params,
      }),
    }),

    getCharacterDetail: build.query<IPerson, { id: string }>({
      query: ({ id }) => `https://swapi.py4e.com/api/people/${id}`,
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterDetailQuery } =
  charactersApi;
