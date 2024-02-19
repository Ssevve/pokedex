import { HomePage, PokemonPage } from '@/pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index Component={HomePage} />
        <Route path="/:pokemon" Component={PokemonPage} />
      </Routes>
    </BrowserRouter>
  );
}
