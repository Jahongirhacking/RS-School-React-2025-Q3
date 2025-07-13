import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/global.scss';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
