/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, describe, Mock, vi } from 'vitest';
import MainPage from '../pages/MainPage';
import localStorageKeys from '../utils/localStorageKeys';

vi.mock('axios');

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

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    test('Handles search term from localStorage on initial load', async () => {
      localStorage.setItem(localStorageKeys.searched, 'vader');

      const mockData = {
        count: 1,
        results: [
          { name: 'Darth Vader', height: '202', created: '2024-01-01' },
        ],
      };

      // Mock axios.get to return mockData
      (axios.get as Mock).mockResolvedValue({ data: mockData });

      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      // Assert Vader is rendered
      expect(await screen.findByText('Darth Vader')).toBeInTheDocument();

      // Assert axios was called with the search param 'vader'
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('people'),
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'vader',
          }),
        })
      );
    });

    test('Manages loading states during API calls', async () => {
      let resolveData: (value: unknown) => void;

      const fetchPromise = new Promise((resolve) => {
        resolveData = resolve;
      });

      (axios.get as Mock).mockReturnValue(fetchPromise);

      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      // 🔄 Assert loading state is shown
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // ✅ Simulate resolved API response
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      resolveData!({
        data: {
          count: 0,
          results: [],
        },
      });

      await waitFor(() => {
        // ✅ Assert loading state disappears
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests:', () => {
    test('Calls API with correct parameters', async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: { count: 0, results: [] },
      });

      (axios.get as Mock) = mockGet;

      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('people'),
        expect.any(Object)
      );
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

      (axios.get as Mock).mockResolvedValue({ data: mockData });

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

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      const cards = await screen.findAllByTestId('person-card');
      expect(cards).toHaveLength(2);
    });

    test('Manages search term state correctly', async () => {
      localStorage.setItem(localStorageKeys.searched, 'kenobi');

      const mockResponse = {
        count: 1,
        results: [
          {
            name: 'Obi-Wan Kenobi',
            height: '182',
            created: '2024-01-01',
          },
        ],
      };

      (axios.get as Mock).mockResolvedValue({ data: mockResponse });

      await act(async () => {
        render(<BrowserRouter><MainPage /></BrowserRouter>);
      });

      expect(await screen.findByText('Obi-Wan Kenobi')).toBeInTheDocument();

      // ✅ Check URL contains 'kenobi'
      expect(axios.get).toHaveBeenCalledWith(
        'https://swapi.py4e.com/api/people',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'kenobi',
          }),
        })
      );

    });
  });
});
