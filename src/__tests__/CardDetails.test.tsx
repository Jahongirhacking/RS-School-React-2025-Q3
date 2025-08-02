/* eslint-disable prettier/prettier */
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, test, vi } from 'vitest';
import MainApp from '../MainApp';

describe('Rendering Card Details:', () => {
  let user: UserEvent;

  beforeEach(async () => {
    cleanup();
    user = userEvent.setup();

    await act(async () => {
      render(<MainApp />);
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('shows person card and updates URL search params when button is clicked', async () => {
    await screen.findAllByTestId(/person-card/i);
    // Find and click the first "More info" button
    const button = (
      await screen.findAllByRole('button', { name: /more info/i })
    )[0];
    await user.click(button);
    const details = screen.getByTestId('person-details');
    expect(await within(details).findByText(/mass/i));
  });

  test('close btn', async () => {
    await screen.findAllByTestId(/person-card/i);
    // Find and click the first "More info" button
    const button = (
      await screen.findAllByRole('button', { name: /more info/i })
    )[0];
    await user.click(button);
    const details = screen.getByTestId('person-details');
    expect(await within(details).findByText(/name/i));
    const closeBtn = await within(details).findByRole('button', {
      name: /close/i,
    });
    await user.click(closeBtn);
    expect(screen.queryByTestId('person-details')).not.toBeInTheDocument();
  });
});
