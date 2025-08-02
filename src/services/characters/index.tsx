import { IApiData } from '../../pages/MainPage';
import IPerson from '../../types/IPerson';
import { baseApiUrl } from '../../utils/config';
import { api } from '../api';

export const charactersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCharacters: build.query<IApiData, { page?: string; search?: string }>({
      query: (params) => ({
        url: `${baseApiUrl}`,
        params,
      }),
    }),

    getCharacterDetail: build.query<IPerson, { id: string }>({
      query: ({ id }) => `${baseApiUrl}/${id}`,
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterDetailQuery } =
  charactersApi;
