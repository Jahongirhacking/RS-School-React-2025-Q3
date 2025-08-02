/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, test } from 'vitest';
import MainApp from '../MainApp';

describe('About page', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    render(<MainApp />);
  });
  test('About page details', async () => {
    const link = screen.getByRole('link', { name: /about/i });
    await user.click(link);

    expect(screen.getByText(/about author information/i));
    expect(screen.getByRole('link', { name: /RS School React Course/i }));
  });
});
