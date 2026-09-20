import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github } from 'lucide-react';
import { GENRES_LIST } from '../services/tmdb';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface-base)',
        borderTop: '1px solid var(--color-border-default)',
        paddingTop: '48px',
        paddingBottom: '32px',
        marginTop: '64px',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <div className="container-xl">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Film size={18} color="#ffffff" strokeWidth={2.5} />
              </div>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '1.15rem' }}>
                FindMe<span style={{ color: 'var(--color-accent)' }}> Movies</span>
              </span>
            </Link>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
              Discover trending movies, explore popular genres, check where to stream or rent, and keep track of your personal watchlist.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: 'var(--color-text-tertiary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                marginBottom: '14px',
                borderLeft: '2px solid var(--color-accent)',
                paddingLeft: '8px'
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/trending" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', transition: 'color 0.2s' }}>
                  Trending Now
                </Link>
              </li>
              <li>
                <Link to="/in-theaters" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', transition: 'color 0.2s' }}>
                  In Theaters
                </Link>
              </li>
              <li>
                <Link to="/popular" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', transition: 'color 0.2s' }}>
                  Popular Films
                </Link>
              </li>
              <li>
                <Link to="/top-rated" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', transition: 'color 0.2s' }}>
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/upcoming" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', transition: 'color 0.2s' }}>
                  Upcoming Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h4
              style={{
                color: 'var(--color-text-tertiary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                marginBottom: '14px',
                borderLeft: '2px solid var(--color-accent)',
                paddingLeft: '8px'
              }}
            >
              Popular Genres
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {GENRES_LIST.slice(0, 8).map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                  style={{
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)';
                    e.currentTarget.style.borderColor = 'var(--color-accent-border)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border-default)';
                  }}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Data Attribution */}
          <div>
            <h4
              style={{
                color: 'var(--color-text-tertiary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                marginBottom: '14px',
                borderLeft: '2px solid var(--color-accent)',
                paddingLeft: '8px'
              }}
            >
              Powered By
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '8px' }}>
              Movie data and artwork provided by The Movie Database (TMDB) & streaming links powered by JustWatch.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border-default)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} FindMe Movies. All rights reserved.
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Crafted for movie lovers worldwide
          </span>
        </div>
      </div>
    </footer>
  );
}
