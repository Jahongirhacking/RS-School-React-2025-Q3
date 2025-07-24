import { act, cleanup, render, screen, within } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, Mock, vi } from 'vitest';
import MainPage from '../pages/MainPage';

vi.mock('axios');

describe('Results/CardList Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeEach(async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering Tests:', () => {
    test('Renders correct number of items when data is provided', async () => {
      const mockData = {
        count: 3,
        next: null,
        previous: null,
        results: [
          { name: 'Luke Skywalker', height: '172', created: '2024-01-01' },
          { name: 'Leia Organa', height: '150', created: '2024-01-02' },
          { name: 'Han Solo', height: '180', created: '2024-01-03' },
        ],
      };

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

      const cards = await screen.findAllByTestId('person-card');
      expect(cards).toHaveLength(3);
    });

    test('Displays "no results" message when data array is empty', async () => {
      const mockData = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

      expect(await screen.findByText(/The list is empty/i)).toBeInTheDocument();
    });

    test('Shows loading state while fetching data', async () => {
      let resolvePromise: (value: unknown) => void;

      // Create a manual promise to control timing
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (axios.get as unknown as Mock).mockReturnValue(promise);

      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

      // Expect loading UI while promise is unresolved
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Now resolve the promise to simulate API completion
      await act(async () => {
        resolvePromise({ data: { count: 0, results: [] } });
      });
    });
  });

  describe('Data Display Tests:', () => {
    test('Correctly displays item names and descriptions', async () => {
      const mockData = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Yoda', height: '66', created: '2024-01-01' }],
      };

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

      expect(await screen.findByText('Yoda')).toBeInTheDocument();
      expect(screen.getByText(/66/)).toBeInTheDocument(); // Height
    });

    test('Handles missing or undefined data gracefully', async () => {
      const mockData = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: undefined, height: undefined, created: undefined }],
      };

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      const card = await screen.findByTestId('person-card');
      expect(within(card).getAllByText(/not defined/i).length).toBeGreaterThan(
        0
      );
    });
  });

  describe('Error handling tests:', () => {
    test('Displays error message when API call fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new Error('Network error'))) as unknown
      );

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

      expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });

    test('Shows appropriate error for 4xx/5xx HTTP status codes', async () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Internal Server Error',
      };

      (axios.get as unknown as Mock).mockRejectedValue(error);

      await act(async () => {
        render(
          <BrowserRouter>
            <MainPage />
          </BrowserRouter>
        );
      });

      expect(
        await screen.findByText(/There is an error! 500/i)
      ).toBeInTheDocument();
    });
  });
});
