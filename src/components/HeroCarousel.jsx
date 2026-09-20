import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Bookmark, Star } from 'lucide-react';
import { tmdbConfig, GENRE_MAP } from '../services/tmdb';
import { isInWatchlist, toggleWatchlist } from '../utils/recentlyViewed';

export default function HeroCarousel({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const currentMovie = movies[currentIndex] || movies[0];

  const handleNext = useCallback(() => {
    if (!movies.length) return;
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const handlePrev = useCallback(() => {
    if (!movies.length) return;
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  // Auto-advance timer (6s)
  useEffect(() => {
    if (isPaused || movies.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext, movies.length]);

  if (!movies || movies.length === 0 || !currentMovie) {
    return null;
  }

  const backdropUrl = currentMovie.backdrop_path
    ? `${tmdbConfig.backdropBaseUrl}${currentMovie.backdrop_path}`
    : null;

  const releaseYear = currentMovie.release_date
    ? currentMovie.release_date.slice(0, 4)
    : '';

  // Resolve genres from either movie.genres or movie.genre_ids
  const movieGenres = currentMovie.genres && currentMovie.genres.length > 0
    ? currentMovie.genres
    : (currentMovie.genre_ids || [])
        .map((gid) => ({ id: gid, name: GENRE_MAP[gid] }))
        .filter((g) => g.name)
        .slice(0, 4);

  const inWatchlist = isInWatchlist(currentMovie.id);

  const handleWatchlistClick = () => {
    toggleWatchlist(currentMovie);
    // Force rerender
    setCurrentIndex((prev) => prev);
  };

  const contentAnimation = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
  };

  return (
    <div
      className="hero-carousel-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '440px',
        maxHeight: '640px',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
        borderRadius: '16px'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={currentMovie.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          )}
          {/* Gradient Overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(10, 10, 10, 0.96) 25%, rgba(10, 10, 10, 0.6) 65%, transparent 100%)',
              zIndex: 2
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.4) 40%, transparent 80%)',
              zIndex: 2
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(10, 10, 10, 0.5) 0%, transparent 25%)',
              zIndex: 2
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Movie Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id + '-content'}
          variants={contentAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            top: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div
            className="hero-content-box"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: 'clamp(16px, 4vw, 44px)',
              pointerEvents: 'auto'
            }}
          >
            {/* Year Badge */}
            {releaseYear && (
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  marginBottom: '8px'
                }}
              >
                <span
                  style={{
                    color: '#c084fc',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  {releaseYear}
                </span>
              </div>
            )}

            {/* Movie Title */}
            <h1
              style={{
                color: '#fafafa',
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 4.5vw, 2.8rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                textShadow: '0 2px 20px rgba(0,0,0,0.7)'
              }}
            >
              {currentMovie.title}
            </h1>

            {/* Ratings & Star Breakdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating5 = (currentMovie.vote_average || 0) / 2;
                  const isFilled = rating5 >= star;
                  const isHalf = !isFilled && rating5 >= star - 0.5;
                  return (
                    <Star
                      key={star}
                      size={14}
                      color="#c084fc"
                      fill={isFilled || isHalf ? '#a855f7' : 'rgba(168, 85, 247, 0.25)'}
                    />
                  );
                })}
              </div>
              <span
                style={{
                  color: '#c084fc',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                {currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A'}
                <span style={{ color: '#999999', fontWeight: 400, fontSize: '0.75rem' }}>
                  /10
                </span>
              </span>
            </div>

            {/* Genre Chips */}
            {movieGenres && movieGenres.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}
              >
                {movieGenres.slice(0, 3).map((g) => (
                  <span
                    key={g.id || g.name}
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: '#c084fc',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '20px',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      padding: '2px 8px'
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview / Synopsis */}
            {currentMovie.overview && (
              <p
                style={{
                  color: 'rgba(250, 250, 250, 0.82)',
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 1px 8px rgba(0,0,0,0.5)'
                }}
              >
                {currentMovie.overview}
              </p>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Info size={15} />
                View Details
              </button>

              <button
                onClick={handleWatchlistClick}
                style={{
                  borderColor: inWatchlist ? '#a855f7' : 'rgba(255, 255, 255, 0.25)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: inWatchlist ? '#c084fc' : '#fafafa',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(8px)',
                  background: inWatchlist ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Bookmark size={15} fill={inWatchlist ? '#a855f7' : 'none'} />
                {inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="hero-nav-arrow hero-prev-arrow"
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          color: '#fafafa',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="hero-nav-arrow hero-next-arrow"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          color: '#fafafa',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Bullets */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              height: '5px',
              width: currentIndex === idx ? '20px' : '5px',
              borderRadius: '3px',
              backgroundColor: currentIndex === idx ? '#a855f7' : 'rgba(255, 255, 255, 0.35)',
              border: 'none',
              padding: 0,
              transition: 'all 0.25s ease'
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-carousel-container {
            height: 52vh !important;
            min-height: 380px !important;
            border-radius: 12px !important;
          }
          .hero-nav-arrow {
            width: 32px !important;
            height: 32px !important;
          }
          .hero-prev-arrow {
            left: 6px !important;
          }
          .hero-next-arrow {
            right: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
