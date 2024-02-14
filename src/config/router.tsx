import { HomePage } from '@/pages/HomePage';
import { createBrowserRouter } from 'react-router-dom';

const routes = [
  {
    element: <HomePage />,
    index: true,
  },
];

export const router = createBrowserRouter(routes);
