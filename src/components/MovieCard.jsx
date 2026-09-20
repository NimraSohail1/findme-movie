import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Bookmark } from 'lucide-react';
import { tmdbConfig } from '../services/tmdb';
import { isInWatchlist, toggleWatchlist } from '../utils/recentlyViewed';
import { getMoviePosterUrl, generatePosterSvg } from '../utils/imageHelper';

export default function MovieCard({ movie, onWatchlistChange }) {
  const [bookmarked, setBookmarked] = useState(() => isInWatchlist(movie.id));
  const navigate = useNavigate();

  const posterUrl = getMoviePosterUrl(movie);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const isAdded = toggleWatchlist(movie);
    setBookmarked(isAdded);
    if (onWatchlistChange) {
      onWatchlistChange(movie.id, isAdded);
    }
  };

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : '';

  return (
    <motion.div
      className="movie-card-container"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleCardClick}
    >
      <div
        style={{
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border-default)',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
          e.currentTarget.style.borderColor = 'var(--color-accent-border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--color-border-default)';
        }}
      >
        {/* Poster Container */}
        <div className="movie-card-poster">
          <img
            src={posterUrl}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = generatePosterSvg(movie.title);
            }}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Watchlist Quick Button (Top-Left) */}
          <button
            onClick={handleBookmarkClick}
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              backgroundColor: bookmarked ? 'var(--color-accent)' : 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              borderRadius: '6px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              transition: 'transform 0.15s ease, background-color 0.15s ease'
            }}
            title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Bookmark
              size={12}
              color={bookmarked ? '#ffffff' : '#ffffff'}
              fill={bookmarked ? '#ffffff' : 'none'}
            />
          </button>

          {/* Rating Badge (Top-Right) */}
          {movie.vote_average > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                borderRadius: '6px',
                padding: '3px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Star size={11} color="var(--color-accent)" fill="var(--color-accent)" />
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Info Block */}
        <div
          style={{
            padding: '10px',
            backgroundColor: 'var(--color-surface-card)'
          }}
        >
          <h3
            style={{
              color: 'var(--color-text-tertiary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              marginBottom: '3px',
              minHeight: '2.1em'
            }}
          >
            {movie.title}
          </h3>
          {releaseYear && (
            <span
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.68rem',
                display: 'block'
              }}
            >
              {releaseYear}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
