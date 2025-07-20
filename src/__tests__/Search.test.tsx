import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import App from '../App';
import Input from '../components/Input';
import SearchButton from '../components/SearchButton';
import localStorageKeys from '../utils/localStorageKeys';

describe('Search test', () => {
  let mockSearch: ReturnType<typeof vi.fn>;
  let mockType: ReturnType<typeof vi.fn>;

  const clearApp = () => {
    cleanup();
    localStorage.clear();
  };

  beforeEach(() => {
    mockSearch = vi.fn();
    mockType = vi.fn();
    render(
      <>
        <Input setInputValue={mockType} />
        <SearchButton onBtnClick={mockSearch} />
      </>
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering Tests:', () => {
    test('Renders search input and search button', () => {
      expect(screen.getByPlaceholderText('Enter name...')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Search/i })
      ).toBeInTheDocument();
    });
    test('Displays previously saved search term from localStorage on mount', () => {
      const value = 'Darth';
      localStorage.setItem(localStorageKeys.searched, value);
      cleanup(); // Ensure a fresh render
      render(<Input setInputValue={mockType} />);
      expect(screen.getByDisplayValue(value)).toBeInTheDocument();
    });

    test('Shows empty input when no saved term exists', () => {
      localStorage.removeItem(localStorageKeys.searched);
      cleanup();
      render(<Input setInputValue={mockType} />);
      const input = screen.getByPlaceholderText(
        'Enter name...'
      ) as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('User Interaction Tests:', () => {
    test('Updates input value when user types', async () => {
      const value = 'Luke';
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText(
        'Enter name...'
      ) as HTMLInputElement;
      await user.type(input, value);
      expect(input).toHaveDisplayValue(value);
    });

    test('Saves search term to localStorage when search button is clicked', async () => {
      clearApp();
      render(<App />);
      const value = 'Vader';
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText(
        'Enter name...'
      ) as HTMLInputElement;
      await user.type(input, value);
      await user.click(screen.getByRole('button', { name: /Search/i }));

      expect(localStorage.getItem(localStorageKeys.searched)).toContain(value);
    });

    test('Trims whitespace from search input before saving', async () => {
      clearApp();
      render(<App />);
      const value = '  Vader  ';
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText(
        'Enter name...'
      ) as HTMLInputElement;
      await user.type(input, value);
      await user.click(screen.getByRole('button', { name: /Search/i }));

      expect(localStorage.getItem(localStorageKeys.searched)).toBe(
        value.trim()
      );
    });

    test('Triggers search callback with correct parameters', async () => {
      clearApp();
      render(<App onBtnClick={mockSearch} />);
      const value = 'hello';
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText(
        'Enter name...'
      ) as HTMLInputElement;
      await user.type(input, value);
      await user.click(screen.getByRole('button', { name: /Search/i }));

      expect(mockSearch).toHaveBeenCalledWith(value);
    });
  });

  describe('LocalStorage Integration:', () => {
    test('Retrieves saved search term on component mount', () => {
      const value = 'Darth';
      localStorage.setItem(localStorageKeys.searched, value);
      cleanup(); // Ensure a fresh render
      render(<Input setInputValue={mockType} />);
      expect(screen.getByDisplayValue(value)).toBeInTheDocument();
    });

    test('Overwrites existing localStorage value when new search is performed', async () => {
      clearApp();
      localStorage.setItem(localStorageKeys.searched, 'oldterm');
      render(<App />);

      const user = userEvent.setup();
      const input = screen.getByDisplayValue('oldterm') as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'newterm');
      await user.click(screen.getByRole('button', { name: /Search/i }));

      expect(localStorage.getItem(localStorageKeys.searched)).toBe('newterm');
    });
  });
});
