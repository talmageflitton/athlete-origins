import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl">&#127967;</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Athlete Origins</h1>
            <p className="text-xs text-slate-400">Sports Trivia Game</p>
          </div>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-white/15 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Home
          </Link>
          <Link
            to="/daily"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/daily'
                ? 'bg-white/15 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Daily Challenge
          </Link>
        </nav>
      </div>
    </header>
  );
}
