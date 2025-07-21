/* eslint-disable prettier/prettier */
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import App from '../App';

describe('Card/Item Component Tests', () => {
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
    test('Displays item name and description correctly', async () => {
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

      const card = await screen.findByTestId('person-card');
      expect(card).toBeInTheDocument();
      expect(screen.getByText(/yoda/i)).toBeInTheDocument();
      expect(screen.getByText(/66/i)).toBeInTheDocument(); // height
    });

    test('Handles missing props gracefully', async () => {
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

      await waitFor(() => {
        expect(
          screen.queryByTestId('person-card') || screen.queryByText(/error/i)
        ).toBeInTheDocument();
      });

      // Check that fallback text appears
      const card = await screen.findByTestId('person-card');
      expect(within(card).getAllByText(/not defined/i).length).toBeGreaterThan(
        0
      );
    });
  });
});
