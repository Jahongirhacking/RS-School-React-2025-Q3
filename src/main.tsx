import MainApp from './MainApp';
import './styles/global.scss';
import { createAppRoot } from './utils/appRoot';

export function renderApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createAppRoot(rootElement);
    root.render(<MainApp />);
  }
}

renderApp();
