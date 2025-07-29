import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AboutPage from '../pages/AboutPage';
import DetailsPage from '../pages/DetailsPage';
import MainPage from '../pages/MainPage';
import NotFoundPage from '../pages/NotFoundPage';

const PathRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<MainPage />}>
          <Route index element={<DetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PathRouter;
