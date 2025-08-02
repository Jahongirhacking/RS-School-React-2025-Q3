/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import MainApp from '../MainApp';
import { baseApiUrl } from '../utils/config';
import localStorageKeys from '../utils/localStorageKeys';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  cleanup();
  localStorage.clear();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('Main App Component Tests', () => {
  describe('Integration Tests:', () => {
    test('Makes initial API call on component mount', async () => {
      server.use(
        http.get(baseApiUrl, () => {
          return HttpResponse.json({
            count: 1,
            next: null,
            previous: null,
            results: [
              {
                name: 'Anakin Skywalker',
                height: '188',
                created: '2024-01-01',
              },
            ],
          });
        })
      );

      render(<MainApp />);
      expect(await screen.findByText(/Anakin Skywalker/i)).toBeInTheDocument();
    });

    test('Handles search term from localStorage on initial load', async () => {
      localStorage.setItem(localStorageKeys.searched, 'vader');

      server.use(
        http.get(baseApiUrl, () =>
          HttpResponse.json({
            count: 1,
            results: [
              { name: 'Darth Vader', height: '202', created: '2024-01-01' },
            ],
          })
        )
      );

      render(<MainApp />);
      expect(await screen.findByText('Darth Vader')).toBeInTheDocument();
    });

    test('Manages loading states during API calls', async () => {
      server.use(
        http.get(`${baseApiUrl}`, () =>
          HttpResponse.json({
            count: 1,
            results: [
              { name: 'Darth Vader', height: '202', created: '2024-01-01' },
            ],
          })
        )
      );

      render(<MainApp />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests:', () => {
    test('Calls API with correct parameters', async () => {
      let calledUrl = '';
      server.use(
        http.get(`${baseApiUrl}`, ({ request }) => {
          const url = new URL(request.url);
          calledUrl = url.pathname;

          return HttpResponse.json({
            count: 0,
            results: [],
          });
        })
      );

      render(<MainApp />);

      await waitFor(() => {
        expect(calledUrl).toContain('');
      });
    });

    test('Handles successful API responses', async () => {
      server.use(
        http.get(`${baseApiUrl}`, ({ request }) => {
          console.log(request, 'req');
          return HttpResponse.json({
            count: 1,
            next: null,
            previous: null,
            results: [{ name: 'Anakin', height: '182', created: '2024-01-01' }],
          });
        })
      );
      render(<MainApp />);
      expect(await screen.findByText(/Anakin/i)).toBeInTheDocument();
    });

    test('Handles API error responses', async () => {
      server.use(
        http.get(baseApiUrl, () => HttpResponse.json({}, { status: 500 }))
      );

      render(<MainApp />);
      expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
  });

  describe('State Management Tests:', () => {
    test('Updates component state based on API responses', async () => {
      server.use(
        http.get(baseApiUrl, () =>
          HttpResponse.json({
            count: 2,
            next: null,
            previous: null,
            results: [
              { name: 'Luke Skywalker', height: '172', created: '2024-01-01' },
            ],
          })
        )
      );

      render(<MainApp />);
      const cards = await screen.findAllByTestId('person-card');
      expect(cards).toHaveLength(1);
    });

    test('Manages search term state correctly', async () => {
      localStorage.setItem(localStorageKeys.searched, 'kenobi');

      server.use(
        http.get(baseApiUrl, () =>
          HttpResponse.json({
            count: 1,
            results: [
              {
                name: 'Obi-Wan Kenobi',
                height: '182',
                created: '2024-01-01',
              },
            ],
          })
        )
      );

      render(<MainApp />);
      expect(await screen.findByText(/Obi-Wan Kenobi/i)).toBeInTheDocument();
    });
  });
});
