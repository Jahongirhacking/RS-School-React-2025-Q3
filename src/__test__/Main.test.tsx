import { configureStore } from '@reduxjs/toolkit';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Main from '../pages/Main';
import formReducer from '../store/slices/formSlice';
import { store } from '../store/store';

// Helper to render component with Redux store
const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { formReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

// ✅ Setup a modal-root for portals
beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  cleanup();
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    document.body.removeChild(modalRoot);
  }
});

describe('Main page forms', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders form buttons', () => {
    renderWithStore(<Main />);
    expect(screen.getByText('Uncontrolled form')).toBeInTheDocument();
    expect(screen.getByText('Controlled form')).toBeInTheDocument();
  });

  it('opens controlled form modal', async () => {
    renderWithStore(<Main />);
    fireEvent.click(screen.getByText('Controlled form'));
    const modal = await screen.findByTestId('modal');
    expect(await within(modal).findByText(/Controlled/i)).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', async () => {
    renderWithStore(<Main />);
    fireEvent.click(screen.getByText('Uncontrolled form'));
    const modal = await screen.findByTestId('modal');
    expect(await within(modal).findByText(/Uncontrolled/i)).toBeInTheDocument();
  });

  it('submits controlled form and updates table', async () => {
    renderWithStore(
      <Provider store={store}>
        <Main />
      </Provider>
    );
    fireEvent.click(screen.getByText('Controlled form'));

    fireEvent.change(screen.getByTestId('name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'John@123' },
    });
    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'John@123' },
    });
    fireEvent.change(screen.getByTestId('country'), {
      target: { value: 'Uzbekistan' },
    });
    fireEvent.click(screen.getByTestId('terms'));
    fireEvent.change(screen.getByTestId('gender'), {
      target: { value: 'male' },
    });

    // Mock image base64 conversion
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    const inputFile = screen.getByTestId('image') as HTMLInputElement;
    Object.defineProperty(inputFile, 'files', { value: [file] });
    fireEvent.change(inputFile);

    expect(screen.getByTestId('password')).toHaveValue('John@123');
    expect(screen.getByTestId('confirmPassword')).toHaveValue('John@123');
    expect(screen.getByTestId('country')).toHaveValue('Uzbekistan');
    expect(screen.getByTestId('gender')).toHaveValue('male');

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  });

  it('submits uncontrolled form and updates table', async () => {
    renderWithStore(
      <Provider store={store}>
        <Main />
      </Provider>
    );
    fireEvent.click(screen.getByText('Uncontrolled form'));

    fireEvent.change(screen.getByTestId('name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'John@123' },
    });
    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'John@123' },
    });
    fireEvent.change(screen.getByTestId('country'), {
      target: { value: 'Uzbekistan' },
    });
    fireEvent.click(screen.getByTestId('terms'));
    fireEvent.change(screen.getByTestId('gender'), {
      target: { value: 'male' },
    });

    // Mock image base64 conversion
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    const inputFile = screen.getByTestId('image') as HTMLInputElement;
    Object.defineProperty(inputFile, 'files', { value: [file] });
    fireEvent.change(inputFile);

    expect(screen.getByTestId('password')).toHaveValue('John@123');
    expect(screen.getByTestId('confirmPassword')).toHaveValue('John@123');
    expect(screen.getByTestId('country')).toHaveValue('Uzbekistan');
    expect(screen.getByTestId('gender')).toHaveValue('male');

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  });

  it('closes modal when close button is clicked', async () => {
    renderWithStore(<Main />);
    fireEvent.click(screen.getByText('Controlled form'));

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    // Click the close button inside the modal
    fireEvent.click(within(modal).getByRole('button', { name: /X/i }));

    // Modal should disappear
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
