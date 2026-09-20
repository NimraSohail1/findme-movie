import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { tmdbService, GENRES_LIST } from '../services/tmdb';
import VerticalMovieList from '../components/VerticalMovieList';

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'release_date.desc' }
];

export default function GenreMovies() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const genreName = useMemo(() => {
    const fromParam = searchParams.get('name');
    if (fromParam) return fromParam;
    const found = GENRES_LIST.find((g) => String(g.id) === String(id));
    return found ? found.name : 'Genre';
  }, [id, searchParams]);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    document.title = `${genreName} Movies | FindMe Movies`;
    setLoading(true);
    setPage(1);

    tmdbService.discoverByGenre(id, 1, sortBy).then((data) => {
      setMovies(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    });
  }, [id, genreName, sortBy]);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const data = await tmdbService.discoverByGenre(id, nextPage, sortBy);
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
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Film size={32} color="var(--color-accent)" />
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
              }}
            >
              {genreName} Movies
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Explore the best {genreName.toLowerCase()} films
          </p>

          {/* Sort Chips */}
          <div className="filter-chips-row" style={{ display: 'flex', gap: '8px' }}>
            {SORT_OPTIONS.map(({ label, value }) => {
              const active = sortBy === value;
              return (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
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
            Loading {genreName} movies...
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
