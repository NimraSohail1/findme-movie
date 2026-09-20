import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import Trending from './pages/Trending';
import NowPlaying from './pages/NowPlaying';
import Popular from './pages/Popular';
import TopRated from './pages/TopRated';
import Upcoming from './pages/Upcoming';
import GenreMovies from './pages/GenreMovies';
import Watchlist from './pages/Watchlist';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div
          className="app-root-container"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-surface-raised)',
            color: 'var(--color-text-tertiary)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/person/:id" element={<PersonDetails />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/in-theaters" element={<NowPlaying />} />
              <Route path="/popular" element={<Popular />} />
              <Route path="/top-rated" element={<TopRated />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/genre/:id" element={<GenreMovies />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
