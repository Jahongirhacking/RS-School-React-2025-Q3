/* eslint-disable prettier/prettier */
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import MainPage from '../pages/MainPage';

// Helper to inspect current URL query
const LocationSpy = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.search}</div>;
};

describe('Rendering Card Details:', () => {
  let user: UserEvent;

  beforeEach(async () => {
    cleanup();
    user = userEvent.setup();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MainPage />
          <LocationSpy />
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('shows person card and updates URL search params when button is clicked', async () => {
    expect(screen.getByTestId('location-display')).not.toHaveTextContent(
      /details/i
    );
    // Find and click the first "More info" button
    const button = (
      await screen.findAllByRole('button', { name: /more info/i })
    )[0];
    await user.click(button);
    // Assert that URL was updated
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      /details=1/i
    );
  });
});
