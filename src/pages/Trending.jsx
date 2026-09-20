import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import VerticalMovieList from '../components/VerticalMovieList';

const TIME_OPTIONS = [
  { label: 'Today', value: 'day' },
  { label: 'This Week', value: 'week' }
];

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [timeWindow, setTimeWindow] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Trending | FindMe Movies';
    setLoading(true);
    tmdbService.getTrendingMovies(timeWindow).then((data) => {
      setMovies(data.results || []);
      setLoading(false);
    });
  }, [timeWindow]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-raised)' }}
    >
      <div className="container-xl" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Flame size={32} color="var(--color-accent)" />
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
              }}
            >
              Trending
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            What the world is watching right now
          </p>

          {/* Filter Chips */}
          <div className="filter-chips-row" style={{ display: 'flex', gap: '8px' }}>
            {TIME_OPTIONS.map(({ label, value }) => {
              const active = timeWindow === value;
              return (
                <button
                  key={value}
                  onClick={() => setTimeWindow(value)}
                  style={{
                    background: active ? 'var(--color-accent-glow)' : 'var(--color-surface-card)',
                    border: '1px solid',
                    borderColor: active ? 'var(--color-accent)' : 'var(--color-border-default)',
                    color: active ? 'var(--color-accent-light)' : 'var(--color-text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    padding: '6px 16px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--color-border-default)';
                    }
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--color-text-tertiary)' }}>
            Loading trending movies...
          </div>
        ) : (
          <VerticalMovieList movies={movies} />
        )}
      </div>
    </motion.div>
  );
}
