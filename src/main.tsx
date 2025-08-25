import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/Error/ErrorBoundary';
import { store } from './store/store';

export function renderApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

renderApp();
