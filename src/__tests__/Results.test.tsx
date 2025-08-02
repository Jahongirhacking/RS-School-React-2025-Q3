import { cleanup, render, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import MainApp from '../MainApp';
import { baseApiUrl } from '../utils/config';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  localStorage.clear();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('Component tests', () => {
  test('Shows 3 cards', async () => {
    server.use(
      http.get(baseApiUrl, () =>
        HttpResponse.json({
          count: 3,
          next: null,
          previous: null,
          results: [
            { name: 'Luke Skywalker', height: '172', created: '2024-01-01' },
            { name: 'Leia Organa', height: '150', created: '2024-01-02' },
            { name: 'Han Solo', height: '180', created: '2024-01-03' },
          ],
        })
      )
    );

    render(<MainApp />);
    const cards = await screen.findAllByTestId('person-card');
    expect(cards).toHaveLength(3);
  });

  test('Shows error 500', async () => {
    server.use(
      http.get(baseApiUrl, () => HttpResponse.json({}, { status: 500 }))
    );

    render(<MainApp />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('Handles missing fields', async () => {
    server.use(
      http.get(baseApiUrl, () =>
        HttpResponse.json({
          count: 1,
          next: null,
          previous: null,
          results: [{ name: undefined, height: undefined, created: undefined }],
        })
      )
    );

    render(<MainApp />);
    const card = (await screen.findAllByTestId('person-card'))[0];
    expect(within(card).getAllByText(/not defined/i).length).toBeGreaterThan(0);
  });
});
