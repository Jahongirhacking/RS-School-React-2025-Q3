/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, test } from 'vitest';
import MainApp from '../MainApp';

describe('FlyOut element:', () => {
  let user: UserEvent;

  beforeEach(() => {
    cleanup();
    user = userEvent.setup();
    render(<MainApp />);
  });

  afterEach(() => {
    cleanup();
  });

  test('test flyout element func', async () => {
    const card = (await screen.findAllByTestId('person-card'))[0];
    expect(screen.queryByTestId('flyout')).not.toBeInTheDocument();
    await user.click(card);
    const flyout = await screen.findByTestId('flyout');
    expect(flyout).toBeInTheDocument();
    expect(within(flyout).getByText(/1 item is selected/i)).toBeInTheDocument();
  });

  test('test flyout unselect', async () => {
    const card = (await screen.findAllByTestId('person-card'))[2];
    await user.click(card);
    const flyout = screen.getByTestId('flyout');
    expect(flyout).toBeInTheDocument();
    expect(within(flyout).getByText(/selected/i)).toBeInTheDocument();

    expect(flyout).toBeInTheDocument();
    const unselectBtn = within(flyout).getByRole('button', {
      name: /unselect/i,
    });
    const downloadBtn = within(flyout).getByRole('button', {
      name: /download/i,
    });
    expect(downloadBtn).toBeInTheDocument();
    // await user.click(downloadBtn);
    await user.click(unselectBtn);
    expect(screen.queryByTestId('flyout')).not.toBeInTheDocument();
  });
});
