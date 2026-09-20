import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Play, Share2, Bookmark, Clock, Globe, Film, ChevronRight } from 'lucide-react';
import { tmdbService, tmdbConfig } from '../services/tmdb';
import { saveRecentlyViewed, isInWatchlist, toggleWatchlist } from '../utils/recentlyViewed';
import { getActorAvatar, getMoviePosterUrl, getMovieBackdropUrl, generateInitialsSvg } from '../utils/imageHelper';
import HorizontalMovieList from '../components/HorizontalMovieList';
import TrailerModal from '../components/TrailerModal';
import Toast from '../components/Toast';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchProviders, setWatchProviders] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    async function loadMovieDetails() {
      try {
        const [
          movieData,
          creditsData,
          videosData,
          providersData,
          keywordsData,
          reviewsData,
          recData
        ] = await Promise.all([
          tmdbService.getMovieById(id),
          tmdbService.getMovieCredits(id),
          tmdbService.getMovieVideos(id),
          tmdbService.getMovieWatchProviders(id),
          tmdbService.getMovieKeywords(id),
          tmdbService.getMovieReviews(id),
          tmdbService.getRecommendedMovies(id)
        ]);

        setMovie(movieData);
        document.title = `${movieData.title} | FindMe Movies`;
        saveRecentlyViewed(movieData);
        setInWatchlist(isInWatchlist(movieData.id));

        setCast(creditsData.cast ? creditsData.cast.slice(0, 16) : []);
        setCrew(creditsData.crew || []);

        // Find YouTube trailer
        const trailer = (videosData.results || []).find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        setTrailerKey(trailer ? trailer.key : (videosData.results?.[0]?.key || null));

        const usProviders = providersData.results?.US || Object.values(providersData.results || {})[0] || {};
        setWatchProviders(usProviders);

        setKeywords(keywordsData.keywords ? keywordsData.keywords.slice(0, 15) : []);
        setReviews(reviewsData.results ? reviewsData.results.slice(0, 5) : []);
        setRecommendations(recData.results || []);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMovieDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setIsToastOpen(true);
    }
  };

  const handleWatchlistToggle = () => {
    if (!movie) return;
    const isAdded = toggleWatchlist(movie);
    setInWatchlist(isAdded);
    setToastMessage(isAdded ? 'Added to Watchlist!' : 'Removed from Watchlist!');
    setIsToastOpen(true);
  };

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount <= 0) return null;
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface-raised)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid rgba(168, 85, 247, 0.2)',
            borderTopColor: 'var(--color-accent)',
            animation: 'spin 1s linear infinite'
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          gap: '16px'
        }}
      >
        <h2>Movie not found.</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 700
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const backdropUrl = getMovieBackdropUrl(movie);
  const posterUrl = getMoviePosterUrl(movie);

  const director = crew.find((c) => c.job === 'Director');
  const writers = crew.filter((c) => ['Writer', 'Screenplay', 'Story'].includes(c.job)).slice(0, 3);

  const hasWatchProviders =
    (watchProviders.flatrate && watchProviders.flatrate.length > 0) ||
    (watchProviders.rent && watchProviders.rent.length > 0) ||
    (watchProviders.buy && watchProviders.buy.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ backgroundColor: 'var(--color-surface-raised)', minHeight: '100vh' }}
    >
      {/* 70vh Hero Backdrop Banner */}
      <div
        className="movie-hero-banner"
        style={{
          position: 'relative',
          minHeight: '520px',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a'
        }}
      >
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: 0.55
            }}
          />
        )}
        {/* Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.6) 45%, transparent 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, #0a0a0a 0%, rgba(9, 9, 11, 0.4) 40%, transparent 100%)'
          }}
        />

        {/* Hero Info Content */}
        <div
          className="container-xl movie-hero-content-container"
          style={{
            position: 'relative',
            paddingTop: 'clamp(80px, 15vh, 180px)',
            paddingBottom: '32px',
            zIndex: 10
          }}
        >
          <div
            className="movie-hero-flex"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '28px',
              flexWrap: 'wrap'
            }}
          >
            {/* Poster with 3D Shadow */}
            {posterUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="movie-hero-poster-box"
                style={{ flexShrink: 0 }}
              >
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  style={{
                    width: 'clamp(130px, 20vw, 220px)',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'block'
                  }}
                />
              </motion.div>
            )}

            {/* Details text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              style={{ flex: 1, minWidth: '280px' }}
            >
              {/* Title */}
              <h1
                style={{
                  color: '#fafafa',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.15,
                  marginBottom: '8px',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)'
                }}
              >
                {movie.title}
              </h1>

              {/* Meta: Year, Runtime, Language, Country */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  color: '#999999',
                  fontSize: '0.88rem'
                }}
              >
                {movie.release_date && <span>{movie.release_date.split('-')[0]}</span>}
                {movie.runtime && (
                  <>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {formatRuntime(movie.runtime)}
                    </span>
                  </>
                )}
                {movie.original_language && (
                  <>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      {movie.original_language}
                    </span>
                  </>
                )}
                {movie.production_countries?.[0] && (
                  <>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                    <span>{movie.production_countries[0].name}</span>
                  </>
                )}
              </div>

              {/* Genre Badges */}
              {movie.genres && movie.genres.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {movie.genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => navigate(`/genre/${g.id}?name=${encodeURIComponent(g.name)}`)}
                      style={{
                        background: 'rgba(168, 85, 247, 0.14)',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        color: '#c084fc',
                        fontWeight: 600,
                        fontSize: '0.74rem',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.14)')}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Star Rating & Vote Count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating5 = (movie.vote_average || 0) / 2;
                    const isFilled = rating5 >= star;
                    const isHalf = !isFilled && rating5 >= star - 0.5;
                    return (
                      <Star
                        key={star}
                        size={16}
                        color="#c084fc"
                        fill={isFilled || isHalf ? '#a855f7' : 'rgba(168, 85, 247, 0.25)'}
                      />
                    );
                  })}
                </div>
                <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.92rem' }}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
                {movie.vote_count > 0 && (
                  <span style={{ color: '#999999', fontSize: '0.78rem' }}>
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                )}
              </div>

              {/* Director & Writers */}
              {director && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#999999', minWidth: '65px' }}>Director</span>
                  <span style={{ color: '#fafafa', fontWeight: 600 }}>{director.name}</span>
                </div>
              )}
              {writers.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#999999', minWidth: '65px' }}>Writers</span>
                  <span style={{ color: '#fafafa', fontWeight: 600 }}>
                    {writers.map((w) => w.name).join(', ')}
                  </span>
                </div>
              )}

              {/* Budget & Revenue */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', fontSize: '0.82rem' }}>
                  {movie.budget > 0 && (
                    <div>
                      <span style={{ color: '#999999', fontSize: '0.72rem', display: 'block' }}>Budget</span>
                      <span style={{ color: '#fafafa', fontWeight: 600 }}>{formatCurrency(movie.budget)}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <span style={{ color: '#999999', fontSize: '0.72rem', display: 'block' }}>Revenue</span>
                      <span style={{ color: '#fafafa', fontWeight: 600 }}>{formatCurrency(movie.revenue)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons: Watch Trailer, Share, Watchlist */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => trailerKey && setIsTrailerOpen(true)}
                  disabled={!trailerKey}
                  style={{
                    background: trailerKey
                      ? 'linear-gradient(135deg, #a855f7, #7e22ce)'
                      : 'rgba(168, 85, 247, 0.3)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: trailerKey ? 'pointer' : 'not-allowed',
                    boxShadow: trailerKey ? '0 4px 16px rgba(168, 85, 247, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (trailerKey) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (trailerKey) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Play size={16} fill="#ffffff" />
                  {trailerKey ? 'Watch Trailer' : 'No Trailer'}
                </button>

                <button
                  onClick={handleWatchlistToggle}
                  style={{
                    background: inWatchlist ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid',
                    borderColor: inWatchlist ? '#a855f7' : 'rgba(255, 255, 255, 0.2)',
                    color: inWatchlist ? '#c084fc' : '#fafafa',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Bookmark size={16} fill={inWatchlist ? '#a855f7' : 'none'} />
                  {inWatchlist ? 'Saved' : 'Watchlist'}
                </button>

                <button
                  onClick={handleShare}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fafafa',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container-xl" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        {/* Synopsis / Overview */}
        {movie.overview && (
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title" style={{ marginBottom: '14px' }}>
              Overview
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                maxWidth: '850px'
              }}
            >
              {movie.overview}
            </p>
          </section>
        )}

        {/* Where to Watch (JustWatch) */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-title" style={{ marginBottom: '18px' }}>
            Where to Watch
          </h2>
          {hasWatchProviders ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                <div>
                  <span style={{ color: '#999999', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Stream Subscription
                  </span>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {watchProviders.flatrate.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: '10px',
                          padding: '6px 12px'
                        }}
                      >
                        <img
                          src={`${tmdbConfig.logoBaseUrl}${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px'
                          }}
                        />
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.82rem', fontWeight: 600 }}>
                          {p.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {watchProviders.rent && watchProviders.rent.length > 0 && (
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Rent
                  </span>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {watchProviders.rent.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: '10px',
                          padding: '6px 12px'
                        }}
                      >
                        <img
                          src={`${tmdbConfig.logoBaseUrl}${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px'
                          }}
                        />
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.82rem', fontWeight: 600 }}>
                          {p.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {watchProviders.buy && watchProviders.buy.length > 0 && (
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Buy
                  </span>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {watchProviders.buy.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: '10px',
                          padding: '6px 12px'
                        }}
                      >
                        <img
                          src={`${tmdbConfig.logoBaseUrl}${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px'
                          }}
                        />
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.82rem', fontWeight: 600 }}>
                          {p.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem', fontWeight: 600, display: 'block' }}>
                  Streaming availability varies by region
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>
                  Check JustWatch or local platforms (Netflix, Prime, Apple TV) for your country.
                </span>
              </div>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('watch ' + movie.title + ' movie online')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                Find Where to Watch →
              </a>
            </div>
          )}
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', marginTop: '10px', display: 'block' }}>
            Streaming data powered by JustWatch
          </span>
        </section>

        {/* Keywords */}
        {keywords.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title" style={{ marginBottom: '14px' }}>
              Keywords
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {keywords.map((k) => (
                <span
                  key={k.id}
                  style={{
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}
                >
                  {k.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Cast Carousel */}
        {cast.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title" style={{ marginBottom: '18px' }}>
              Top Cast
            </h2>
            <div className="horizontal-scroll-container">
              <div className="horizontal-movie-row">
                {cast.map((actor) => {
                  const avatarUrl = getActorAvatar(actor.name, actor.profile_path);
                  return (
                    <motion.div
                      key={actor.id}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      onClick={() => navigate(`/person/${actor.id}`)}
                      style={{
                        width: '110px',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-default)'
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '140px',
                            backgroundColor: 'var(--color-surface-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={avatarUrl}
                            alt={actor.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = generateInitialsSvg(actor.name);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div style={{ padding: '8px' }}>
                          <h4
                            style={{
                              color: 'var(--color-text-tertiary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {actor.name}
                          </h4>
                          <span
                            style={{
                              color: 'var(--color-text-secondary)',
                              fontSize: '0.68rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block'
                            }}
                          >
                            {actor.character}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* You May Also Like / Recommendations */}
        {recommendations.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title" style={{ marginBottom: '18px' }}>
              You May Also Like
            </h2>
            <HorizontalMovieList movies={recommendations} />
          </section>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 className="section-title" style={{ marginBottom: '18px' }}>
              Reviews
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((rev) => {
                const initial = rev.author?.charAt(0)?.toUpperCase() || '?';
                const dateFormatted = rev.created_at
                  ? new Date(rev.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : '';
                return (
                  <div
                    key={rev.id}
                    style={{
                      backgroundColor: 'var(--color-surface-card)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {initial}
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 600, fontSize: '0.88rem', display: 'block' }}>
                          {rev.author}
                        </span>
                        {dateFormatted && (
                          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{dateFormatted}</span>
                        )}
                      </div>
                      {rev.author_details?.rating && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} color="var(--color-accent)" fill="var(--color-accent)" />
                          <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {rev.author_details.rating}/10
                          </span>
                        </div>
                      )}
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                      {rev.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        videoKey={trailerKey}
        onClose={() => setIsTrailerOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
      />
    </motion.div>
  );
}
