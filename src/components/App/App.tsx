import { ErrorFallback } from '@/components/ErrorFallback';
import { HomePage } from '@/pages/HomePage';
import { PokemonPage } from '@/pages/PokemonPage';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/:pokemon" element={<PokemonPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
