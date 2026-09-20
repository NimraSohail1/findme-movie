import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import VerticalMovieList from '../components/VerticalMovieList';

export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    document.title = 'Top Rated Movies | FindMe Movies';
    setLoading(true);
    tmdbService.getTopRatedMovies(1).then((data) => {
      setMovies(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    });
  }, []);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const data = await tmdbService.getTopRatedMovies(nextPage);
    setMovies((prev) => [...prev, ...(data.results || [])]);
    setPage(data.page || nextPage);
    setTotalPages(data.total_pages || totalPages);
    setLoadingMore(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-raised)' }}
    >
      <div className="container-xl" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={32} color="var(--color-accent)" />
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
              }}
            >
              Top Rated Movies
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            All-time highest rated cinematic gems
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--color-text-tertiary)' }}>
            Loading top rated movies...
          </div>
        ) : (
          <>
            <VerticalMovieList movies={movies} />
            {page < totalPages && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    background: 'var(--color-accent-glow)',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-accent-light)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '10px 28px',
                    borderRadius: '50px',
                    cursor: loadingMore ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loadingMore ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
