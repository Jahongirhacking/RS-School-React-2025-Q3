import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import formReducer, { setCountries } from '../store/slices/formSlice';

// Mock Main to avoid heavy rendering
vi.mock('../pages/Main', () => ({
  default: () => <div>Main page mock</div>,
}));

describe('App component', () => {
  const setupStore = () =>
    configureStore({
      reducer: {
        form: formReducer,
      },
    });

  it('renders Main inside Suspense', async () => {
    const store = setupStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Main mock should render
    expect(await screen.findByText('Main page mock')).toBeInTheDocument();
  });

  it('dispatches setCountries on mount', () => {
    const store = setupStore();
    const spy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(spy).toHaveBeenCalledWith(
      setCountries(['Uzbekistan', 'Russia', 'United States of America'])
    );
  });
});
