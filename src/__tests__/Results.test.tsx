import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import App from '../App';

describe('Results/CardList Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeEach(() => {
    render(<App />);
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

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      clearApp();
      render(<App />);

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

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      clearApp();
      render(<App />);

      expect(await screen.findByText(/The list is empty/i)).toBeInTheDocument();
    });

    test('Shows loading state while fetching data', async () => {
      const promise = Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 0, results: [] }),
      });

      vi.stubGlobal('fetch', vi.fn(() => promise) as unknown);

      clearApp();
      render(<App />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await promise; // let the fetch finish
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

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      clearApp();
      render(<App />);

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

      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          })
        ) as unknown
      );

      clearApp();
      render(<App />);

      expect(await screen.findByText(/there is an error/i)).toBeInTheDocument(); // fallback text in card
    });
  });

  describe('Error handling tests:', () => {
    test('Displays error message when API call fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new Error('Network error'))) as unknown
      );

      clearApp();
      render(<App />);

      expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });

    test('Shows appropriate error for 4xx/5xx HTTP status codes', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
          })
        ) as unknown
      );

      clearApp();
      render(<App />);

      expect(await screen.findByText(/500/i)).toBeInTheDocument(); // or general "error"
    });
  });
});
