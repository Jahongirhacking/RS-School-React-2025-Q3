/* eslint-disable prettier/prettier */
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, Mock, vi } from 'vitest';
import MainPage from '../pages/MainPage';

vi.mock('axios');

describe('Card/Item Component Tests', () => {
  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeEach(() => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
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

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

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

      (axios.get as Mock).mockResolvedValue({ data: mockData });

      clearApp();
      render(
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      );

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
