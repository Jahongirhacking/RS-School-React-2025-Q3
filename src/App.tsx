import { Suspense, useState, useMemo } from 'react';
import './styles/global.scss';
import Countries, { ResourceType } from './pages/Countries';
import { createDataResource } from './utils/dataResource';
import Spinner from './components/Special/Spinner';

const App = () => {
  const [progress, setProgress] = useState(0);

  const resource = useMemo(
    () => createDataResource('/owid-co2-data.json', setProgress),
    []
  );

  return (
    <Suspense
      fallback={
        <div className="p-4">
          <Spinner progress={progress} />
        </div>
      }
    >
      <Countries resource={resource as ResourceType} />
    </Suspense>
  );
};

export default App;
