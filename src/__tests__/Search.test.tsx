import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import Input from '../components/Input';
import SearchButton from '../components/SearchButton';

describe('Search test', () => {
  let mockSearch: ReturnType<typeof vi.fn>;
  let mockType: ReturnType<typeof vi.fn>;

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
  });
});
