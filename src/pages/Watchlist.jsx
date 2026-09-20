import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Film } from 'lucide-react';
import { getWatchlist } from '../utils/recentlyViewed';
import VerticalMovieList from '../components/VerticalMovieList';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Watchlist | FindMe Movies';
    setWatchlist(getWatchlist());
  }, []);

  const handleWatchlistChange = () => {
    setWatchlist(getWatchlist());
  };

  const handleClearAll = () => {
    localStorage.removeItem('findme_watchlist');
    setWatchlist([]);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Bookmark size={32} color="var(--color-accent)" />
              <h1
                style={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em'
                }}
              >
                My Watchlist
              </h1>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {watchlist.length === 1 ? '1 saved movie' : `${watchlist.length} saved movies`}
            </p>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-default)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border-default)';
              }}
            >
              <Trash2 size={15} />
              Clear Watchlist
            </button>
          )}
        </div>

        {/* Content */}
        {watchlist.length > 0 ? (
          <VerticalMovieList
            movies={watchlist}
            onWatchlistChange={handleWatchlistChange}
          />
        ) : (
          <div
            style={{
              padding: '64px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border-default)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '500px',
              margin: '40px auto'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bookmark size={28} color="var(--color-accent)" />
            </div>
            <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.2rem', fontWeight: 700 }}>
              Your Watchlist is Empty
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Save movies you want to watch later by clicking the bookmark icon on any movie card or detail page.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '8px',
                background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '10px',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Film size={16} />
              Explore Movies
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
