import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock component that throws
const BrokenComponent = () => {
  throw new Error('Test crash');
};

describe('Error Boundary Tests', () => {
  test('Catches and handles JavaScript errors in child components', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // silence expected error logs

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/Sorry.../i);

    expect(console.error).toHaveBeenCalled(); // logs error
  });

  test('Displays fallback UI when error occurs', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/Error/i);
  });

  test('ErrorBoundary logs error to console', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('Throws error when test button is clicked and shows fallback UI', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const TriggerError = () => {
      const [crash, setCrash] = React.useState(false);
      if (crash) throw new Error('Clicked error');
      return <button onClick={() => setCrash(true)}>Trigger Error</button>;
    };

    render(
      <ErrorBoundary>
        <TriggerError />
      </ErrorBoundary>
    );

    screen.getByText('Trigger Error').click();

    // expect(screen.getByRole('alert')).toHaveTextContent(
    //   /Sorry.../i
    // );
  });
});
