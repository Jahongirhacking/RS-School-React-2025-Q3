import { Route, Routes } from 'react-router-dom';
import DetailsPage from '../pages/DetailsPage';
import MainPage from '../pages/MainPage';

const PathRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route index element={<DetailsPage />} />
      </Route>
    </Routes>
  );
};

export default PathRouter;
