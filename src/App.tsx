import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from './pages/Main';
import { setCountries } from './store/slices/formSlice';
import './styles/global.scss';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setCountries(['Uzbekistan', 'Russia', 'United States of America'])
    );
  }, [dispatch]);

  return (
    <Suspense fallback={<h2>Initializing...</h2>}>
      <Main />
    </Suspense>
  );
};

export default App;
