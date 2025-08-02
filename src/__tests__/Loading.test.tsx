/* eslint-disable prettier/prettier */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, vi } from 'vitest';
import MainApp from '../MainApp';

describe('Loading Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering Tests:', () => {
    test('Renders loading indicator during fetch', async () => {
      // Delay the fetch to keep the loading indicator visible
      const delayedFetch = () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ count: 0, results: [] }),
              }),
            200
          )
        );

      vi.stubGlobal('fetch', vi.fn(delayedFetch) as unknown);

      clearApp();
      render(<MainApp />);

      // Expect loading indicator to be present before data loads
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    //   test('Does not show loading indicator after fetch', async () => {
    //     const mockData = {
    //       count: 1,
    //       next: null,
    //       previous: null,
    //       results: [
    //         { name: 'Luke Skywalker', height: '172', created: '2024-01-01' },
    //       ],
    //     };

    //     vi.stubGlobal(
    //       'fetch',
    //       vi.fn(() =>
    //         Promise.resolve({
    //           ok: true,
    //           json: () => Promise.resolve(mockData),
    //         })
    //       ) as unknown
    //     );

    //     clearApp();
    //     render(<BrowserRouter><MainPage /></BrowserRouter>);

    //     await screen.findByText(/luke/i); // Wait for data to render

    //     expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    //   });
  });

  describe('Accessibility Tests:', () => {
    test('Loading indicator has appropriate ARIA label', async () => {
      const delayedFetch = () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ count: 0, results: [] }),
              }),
            200
          )
        );

      vi.stubGlobal('fetch', vi.fn(delayedFetch) as unknown);

      clearApp();
      render(<MainApp />);

      // Expect ARIA role or label to exist (depending on your implementation)
      const loadingElement = screen.getByLabelText(/loading/i);
      expect(loadingElement).toBeInTheDocument();
    });
  });
});
