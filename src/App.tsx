import { Suspense } from 'react';
import PathRouter from './router';

const App = () => {
  return (
    <Suspense fallback={<h2>Initializing...</h2>}>
      <PathRouter />
    </Suspense>
  );
};

export default App;
