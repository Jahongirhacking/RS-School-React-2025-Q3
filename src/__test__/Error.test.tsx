import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../components/Error/ErrorBoundary';

// A dummy component that throws an error
const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe child')).toBeInTheDocument();
  });

  it('catches error and displays fallback UI', () => {
    // silence console.error so test output is clean
    const spy = vi.spyOn(console, 'error').mockImplementation(() => { });

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Sorry.. there was an error!'
    );
    expect(
      screen.getByRole('link', { name: /Back to home/i })
    ).toBeInTheDocument();

    spy.mockRestore();
  });
});
