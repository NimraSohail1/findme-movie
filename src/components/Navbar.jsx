import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Film, Star, ChevronDown, Menu, X, Bookmark, Flame, Clapperboard, Award, Sparkles, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { tmdbService, tmdbConfig, GENRES_LIST } from '../services/tmdb';
import { getWatchlist } from '../utils/recentlyViewed';
import { getMoviePosterUrl, generatePosterSvg } from '../utils/imageHelper';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  const { theme, toggleTheme, isDark } = useTheme();

  const searchRef = useRef(null);
  const genreRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll event for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update watchlist count
  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('watchlistUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('watchlistUpdated', updateCount);
    };
  }, []);

  // Live search debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const data = await tmdbService.searchMovies(query);
      setResults(data.results ? data.results.slice(0, 8) : []);
      setIsSearching(false);
      setIsSearchOpen(true);
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click away listener for search dropdown and genre menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setIsGenreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMovie = (id) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(`/movie/${id}`);
  };

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    background: isActive ? 'var(--color-accent-bg)' : 'transparent'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        backgroundColor: 'var(--color-navbar-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border-default)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      <div
        className="container-xl"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          gap: '16px'
        }}
      >
        {/* Brand Logo */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Film size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              FindMe<span style={{ color: 'var(--color-accent)' }}> Movies</span>
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px'
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/trending" style={navLinkStyles}>
            <Flame size={15} color="var(--color-accent)" />
            Trending
          </NavLink>
          <NavLink to="/in-theaters" style={navLinkStyles}>
            <Clapperboard size={15} />
            In Theaters
          </NavLink>
          <NavLink to="/popular" style={navLinkStyles}>
            <Sparkles size={15} />
            Popular
          </NavLink>
          <NavLink to="/top-rated" style={navLinkStyles}>
            <Award size={15} />
            Top Rated
          </NavLink>
          <NavLink to="/upcoming" style={navLinkStyles}>
            <Calendar size={15} />
            Upcoming
          </NavLink>

          {/* Genres Dropdown */}
          <div ref={genreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsGenreOpen(!isGenreOpen)}
              style={{
                color: isGenreOpen ? 'var(--color-accent)' : 'var(--color-text-primary)',
                fontWeight: 500,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isGenreOpen ? 'var(--color-accent-bg)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Genres
              <ChevronDown
                size={14}
                style={{
                  transform: isGenreOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {isGenreOpen && (
              <div
                className="glass-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  width: '320px',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px',
                  zIndex: 110
                }}
              >
                {GENRES_LIST.map((genre) => (
                  <NavLink
                    key={genre.id}
                    to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                    onClick={() => setIsGenreOpen(false)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'all 0.15s ease',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-accent-bg)';
                      e.currentTarget.style.color = 'var(--color-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                  >
                    {genre.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist */}
          <NavLink to="/watchlist" style={navLinkStyles}>
            <Bookmark size={15} />
            Watchlist
            {watchlistCount > 0 && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  marginLeft: '2px'
                }}
              >
                {watchlistCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Live Search Bar & Theme Switcher & Mobile Menu */}
        <div
          className="navbar-search-section"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: '1',
            maxWidth: '380px',
            justifyContent: 'flex-end',
            minWidth: 0
          }}
        >
          <div ref={searchRef} className="navbar-search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-input-bg)',
                borderRadius: '50px',
                border: '1px solid var(--color-border-default)',
                padding: '6px 12px',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={15} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setIsSearchOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.82rem',
                  width: '100%',
                  outline: 'none',
                  minWidth: 0
                }}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setIsSearchOpen(false);
                  }}
                  style={{ color: 'var(--color-text-secondary)', padding: 0, display: 'flex', alignItems: 'center' }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && (
              <div
                className="glass-dropdown search-dropdown-results"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '100%',
                  minWidth: '280px',
                  maxWidth: '92vw',
                  borderRadius: '12px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  padding: '8px',
                  zIndex: 110
                }}
              >
                {isSearching ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    Searching movies...
                  </div>
                ) : results.length > 0 ? (
                  results.map((movie) => {
                    const posterUrl = getMoviePosterUrl(movie);
                    const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
                    return (
                      <div
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-card-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div
                          style={{
                            width: '38px',
                            height: '52px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-surface-card)',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = generatePosterSvg(movie.title);
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: 'var(--color-text-primary)',
                              fontWeight: 600,
                              fontSize: '0.82rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {movie.title}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'var(--color-text-secondary)',
                              fontSize: '0.72rem',
                              marginTop: '2px'
                            }}
                          >
                            {year && <span>{year}</span>}
                            {movie.vote_average > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-accent)' }}>
                                <Star size={11} fill="currentColor" />
                                {movie.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    No movies found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Switcher Button - Always visible directly on screen */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-input-bg)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(15deg) scale(1.08)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              e.currentTarget.style.borderColor = 'var(--color-border-default)';
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-input-bg)',
              border: '1px solid var(--color-border-default)',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="glass-dropdown mobile-drawer-panel"
          style={{
            padding: '14px 16px 20px',
            borderTop: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto'
          }}
        >
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/trending" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Flame size={15} color="var(--color-accent)" />
            Trending
          </NavLink>
          <NavLink to="/in-theaters" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Clapperboard size={15} />
            In Theaters
          </NavLink>
          <NavLink to="/popular" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Sparkles size={15} />
            Popular
          </NavLink>
          <NavLink to="/top-rated" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Award size={15} />
            Top Rated
          </NavLink>
          <NavLink to="/upcoming" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Calendar size={15} />
            Upcoming
          </NavLink>
          <NavLink to="/watchlist" onClick={() => setIsMobileMenuOpen(false)} style={navLinkStyles}>
            <Bookmark size={15} />
            Watchlist {watchlistCount > 0 && `(${watchlistCount})`}
          </NavLink>

          <div style={{ marginTop: '10px', borderTop: '1px solid var(--color-border-default)', paddingTop: '10px' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Genres
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                marginTop: '8px'
              }}
            >
              {GENRES_LIST.map((genre) => (
                <NavLink
                  key={genre.id}
                  to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-surface-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {genre.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .navbar-search-section {
            gap: 6px !important;
          }
          .theme-toggle-btn {
            width: 34px !important;
            height: 34px !important;
          }
          .mobile-menu-btn {
            width: 34px !important;
            height: 34px !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-search-wrapper {
            max-width: 145px !important;
          }
          .search-dropdown-results {
            position: fixed !important;
            top: 64px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            max-width: none !important;
          }
        }
        @media (max-width: 360px) {
          .navbar-search-wrapper {
            max-width: 110px !important;
          }
        }
      `}</style>
    </header>
  );
}
