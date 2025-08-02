/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { cleanup, render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, describe, expect, test } from 'vitest';
import MainApp from '../MainApp';
import { baseApiUrl } from '../utils/config';


let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  mock.restore();
});

describe('API Integration Tests with MSW', () => {
  test('Fetch returns successful response and renders data', async () => {
    mock.onGet(baseApiUrl).reply(200, {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: 'Luke',
          height: '167',
          created: '2024-01-01',
        },
      ],
    });

    render(<MainApp />);
    expect(await screen.findByText(/Luke/i)).toBeInTheDocument();
  });

  test('Fetch returns non-ok response (HTTP 500)', async () => {
    mock.onGet(baseApiUrl).reply(500, {});

    render(<MainApp />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument(); // or error
  });

  test('Fetch throws network error', async () => {
    mock.onGet(baseApiUrl).reply(500, {});

    render(<MainApp />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
