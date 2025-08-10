import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  baseQuery: baseQueryWithRetry,
  tagTypes: ['people'],
  endpoints: () => ({}),
});
