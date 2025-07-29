/* eslint-disable prettier/prettier */
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { vi } from 'vitest';
import Pagination from '../components/Pagination'; // Adjust path to your Pagination component
import { MainContext, MainProps } from '../pages/mainContext';

// Mock SearchParams enum
const mockSearchParams = {
  Page: 'page',
};

// Mock context value
const mockContext: MainProps = {
  apiData: {
    previous: null,
    next: null,
    results: [],
  },
  searched: '',
};

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('Pagination Component', () => {
  const mockSetSearchParams = vi.fn<
    ReturnType<typeof useSearchParams>[1]
  >();

  beforeEach(() => {
    const mockSetSearchParams = vi.fn<
      ReturnType<typeof useSearchParams>[1]
    >();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ [mockSearchParams.Page]: '1' }),
      mockSetSearchParams,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders current page number', () => {
    render(
      <BrowserRouter>
        <MainContext.Provider value={mockContext}>
          <Pagination />
        </MainContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('renders Previous button when previous page exists', () => {
    const contextWithPrev: MainProps = {
      apiData: {
        previous: 'http://api.example.com?page=1',
        next: null,
        results: [],
      },
      searched: '',
    };

    render(
      <BrowserRouter>
        <MainContext.Provider value={contextWithPrev}>
          <Pagination />
        </MainContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('renders Next button when next page exists', () => {
    const contextWithNext: MainProps = {
      apiData: {
        previous: null,
        next: 'http://api.example.com?page=2',
        results: [],
      },
      searched: '',
    };

    render(
      <BrowserRouter>
        <MainContext.Provider value={contextWithNext}>
          <Pagination />
        </MainContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });
});