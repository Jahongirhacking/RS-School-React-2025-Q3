/* eslint-disable prettier/prettier */
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, describe, expect } from 'vitest';
import MainApp from '../MainApp';
import { baseApiUrl } from '../utils/config';

const server = setupServer(
  http.get(`${baseApiUrl}`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Yoda', height: '66', created: '2024-01-01' }],
    });
  })
);

describe('Card/Item Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    clearApp();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('Rendering Tests:', () => {
    test('Displays item name and description correctly', async () => {
      render(<MainApp />);

      const card = await screen.findByTestId('person-card');
      expect(card).toBeInTheDocument();
      expect(screen.getByText(/yoda/i)).toBeInTheDocument();
      expect(screen.getByText(/66/i)).toBeInTheDocument(); // height
    });

    test('Handles missing props gracefully', async () => {
      render(<MainApp />);

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
