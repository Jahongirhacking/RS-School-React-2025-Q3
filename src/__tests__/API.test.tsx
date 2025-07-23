/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { act, cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, describe, vi } from 'vitest';
import MainPage from '../pages/MainPage';

describe('API Integration Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Mocked API Calls:', () => {
    test('Fetch returns successful response and renders data', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Ahsoka Tano',
            height: '167',
            created: '2024-01-01',
          },
        ],
      };

      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      vi.stubGlobal('fetch', fetchMock as unknown);

      clearApp();

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(fetchMock).toHaveBeenCalled();
      expect(await screen.findByText('Ahsoka Tano')).toBeInTheDocument();
    });

    test('Fetch returns non-ok response (HTTP 500)', async () => {
      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })
      );

      vi.stubGlobal('fetch', fetchMock as unknown);

      clearApp();

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(await screen.findByText(/the list is empty/i)).toBeInTheDocument(); // or /error/i
    });

    test('Fetch throws network error', async () => {
      const fetchMock = vi.fn(() => Promise.reject(new Error('Network error')));

      vi.stubGlobal('fetch', fetchMock as unknown);

      clearApp();

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(await screen.findByText(/there is an error/i)).toBeInTheDocument();
    });
  });
});
