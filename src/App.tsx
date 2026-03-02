import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { DailyPage } from './pages/DailyPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play" element={<GamePage />} />
            <Route path="/daily" element={<DailyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
