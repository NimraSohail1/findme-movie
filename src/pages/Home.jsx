import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Flame, Star, Sparkles, Calendar } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import HorizontalMovieList from '../components/HorizontalMovieList';
import SkeletonLoader from '../components/SkeletonLoader';
import { tmdbService } from '../services/tmdb';
import { getRecentlyViewed, clearRecentlyViewed } from '../utils/recentlyViewed';

export default function Home() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'FindMe Movies';
    setRecentMovies(getRecentlyViewed());

    // Fetch Discover / Hero Movies
    tmdbService.discoverMovies().then((data) => {
      setHeroMovies(data.results || []);
      setLoadingHero(false);
    });

    // Fetch Trending
    tmdbService.getTrendingMovies('day').then((data) => {
      setTrendingMovies(data.results || []);
      setLoadingTrending(false);
    });

    // Fetch Popular
    tmdbService.getPopularMovies(1).then((data) => {
      setPopularMovies(data.results || []);
      setLoadingPopular(false);
    });

    // Fetch Top Rated
    tmdbService.getTopRatedMovies(1).then((data) => {
      setTopRatedMovies(data.results || []);
      setLoadingTopRated(false);
    });

    // Fetch Upcoming
    tmdbService.getUpcomingMovies(1).then((data) => {
      setUpcomingMovies(data.results || []);
      setLoadingUpcoming(false);
    });
  }, []);

  const handleClearRecent = () => {
    clearRecentlyViewed();
    setRecentMovies([]);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-raised)' }}
    >
      {/* Hero Carousel Section */}
      <div className="container-xl" style={{ paddingTop: '16px', paddingBottom: '24px' }}>
        {loadingHero ? (
          <div
            style={{
              height: '70vh',
              minHeight: '480px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-surface-card)'
            }}
            className="skeleton-shimmer"
          />
        ) : (
          <HeroCarousel movies={heroMovies} />
        )}
      </div>

      <div className="container-xl" style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '64px' }}>
        {/* Recently Viewed (if any) */}
        {recentMovies.length > 0 && (
          <motion.section variants={sectionVariants} initial="initial" animate="animate">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 className="section-title">
                Recently Viewed
              </h2>
              <button
                onClick={handleClearRecent}
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
              >
                <Trash2 size={13} />
                Clear
              </button>
            </div>
            <HorizontalMovieList movies={recentMovies} />
          </motion.section>
        )}

        {/* Trending Today */}
        <motion.section variants={sectionVariants} initial="initial" animate="animate">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="section-title">
              <Flame size={18} color="var(--color-accent)" />
              Trending Today
            </h2>
            <button
              onClick={() => navigate('/trending')}
              className="see-all-btn"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>
          {loadingTrending ? <SkeletonLoader /> : <HorizontalMovieList movies={trendingMovies} />}
        </motion.section>

        {/* Popular Movies */}
        <motion.section variants={sectionVariants} initial="initial" animate="animate">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="section-title">
              <Sparkles size={18} color="var(--color-accent)" />
              Popular Movies
            </h2>
            <button
              onClick={() => navigate('/popular')}
              className="see-all-btn"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>
          {loadingPopular ? <SkeletonLoader /> : <HorizontalMovieList movies={popularMovies} />}
        </motion.section>

        {/* Top Rated Movies */}
        <motion.section variants={sectionVariants} initial="initial" animate="animate">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="section-title">
              <Star size={18} color="var(--color-accent)" />
              Top Rated Movies
            </h2>
            <button
              onClick={() => navigate('/top-rated')}
              className="see-all-btn"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>
          {loadingTopRated ? <SkeletonLoader /> : <HorizontalMovieList movies={topRatedMovies} />}
        </motion.section>

        {/* Upcoming Movies */}
        <motion.section variants={sectionVariants} initial="initial" animate="animate">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="section-title">
              <Calendar size={18} color="var(--color-accent)" />
              Upcoming Movies
            </h2>
            <button
              onClick={() => navigate('/upcoming')}
              className="see-all-btn"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>
          {loadingUpcoming ? <SkeletonLoader /> : <HorizontalMovieList movies={upcomingMovies} />}
        </motion.section>
      </div>
    </motion.div>
  );
}
