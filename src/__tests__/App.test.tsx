/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, describe, vi } from 'vitest';
import MainPage from '../pages/MainPage';
import localStorageKeys from '../utils/localStorageKeys';

describe('Main App Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeEach(async () => {
    clearApp();
    await act(async () => {
      render(<BrowserRouter><MainPage /></BrowserRouter>);
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Integration Tests:', () => {
    test('Makes initial API call on component mount', async () => {
      const mockData = {
        count: 1,
        next: null,
        previous: null,
        results: [
          { name: 'Anakin Skywalker', height: '188', created: '2024-01-01' },
        ],
      };

      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        })
      );
      vi.stubGlobal('fetch', fetchMock as unknown);

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('Handles search term from localStorage on initial load', async () => {
      localStorage.setItem(localStorageKeys.searched, 'vader');

      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              count: 1,
              results: [
                { name: 'Darth Vader', height: '202', created: '2024-01-01' },
              ],
            }),
        })
      );
      vi.stubGlobal('fetch', fetchMock as unknown);

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      await screen.findByText('Darth Vader');
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('vader'));
    });

    test('Manages loading states during API calls', async () => {
      let resolveFetch!: (value: object) => void;

      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      vi.stubGlobal(
        'fetch',
        vi.fn(() => fetchPromise as unknown)
      );

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Now resolve fetch to simulate data arrival
      resolveFetch({
        ok: true,
        json: () =>
          Promise.resolve({
            count: 0,
            results: [],
          }),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests:', () => {
    test('Calls API with correct parameters', async () => {
      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 0, results: [] }),
        })
      );

      vi.stubGlobal('fetch', fetchMock as unknown);

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('people'));
    });

    test('Handles successful API responses', async () => {
      const mockData = {
        count: 1,
        next: null,
        previous: null,
        results: [
          { name: 'Obi-Wan Kenobi', height: '182', created: '2024-01-01' },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(await screen.findByText('Obi-Wan Kenobi')).toBeInTheDocument();
    });

    test('Handles API error responses', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new Error('Network error')) as unknown)
      );

      expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
  });

  describe('State Management Tests:', () => {
    test('Updates component state based on API responses', async () => {
      const mockData = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: 'Luke Skywalker', height: '172', created: '2024-01-01' },
          { name: 'Leia Organa', height: '150', created: '2024-01-02' },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      const cards = await screen.findAllByTestId('person-card');
      expect(cards).toHaveLength(2);
    });

    test('Manages search term state correctly', async () => {
      localStorage.setItem(localStorageKeys.searched, 'kenobi');

      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              count: 1,
              results: [
                {
                  name: 'Obi-Wan Kenobi',
                  height: '182',
                  created: '2024-01-01',
                },
              ],
            }),
        })
      );

      vi.stubGlobal('fetch', fetchMock as unknown);

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(await screen.findByText('Obi-Wan Kenobi')).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('kenobi'));
    });
  });
});
