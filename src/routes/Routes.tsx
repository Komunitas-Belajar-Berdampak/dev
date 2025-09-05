import type { RouteObject } from 'react-router-dom';
import Home from '../components/pages/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
];

export default routes;
