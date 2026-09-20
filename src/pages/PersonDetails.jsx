import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ExternalLink, User } from 'lucide-react';
import { tmdbService, tmdbConfig } from '../services/tmdb';
import { getActorAvatar, generateInitialsSvg } from '../utils/imageHelper';
import MovieCard from '../components/MovieCard';

const GENDER_MAP = {
  1: 'Female',
  2: 'Male',
  3: 'Non-binary'
};

export default function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      tmdbService.getPersonDetails(id),
      tmdbService.getPersonMovies(id)
    ])
      .then(([personData, moviesData]) => {
        setPerson(personData);
        document.title = `${personData.name} | FindMe Movies`;

        const castMovies = moviesData.cast
          ? [...moviesData.cast]
              .filter((m) => m.poster_path)
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .slice(0, 24)
          : [];

        const crewMovies = ['Directing', 'Writing'].includes(personData.known_for_department)
          ? (moviesData.crew || [])
              .filter((m) => m.poster_path && ['Director', 'Writer', 'Screenplay'].includes(m.job))
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .slice(0, 12)
          : [];

        const allUnique = [...castMovies];
        crewMovies.forEach((cm) => {
          if (!allUnique.some((m) => m.id === cm.id)) {
            allUnique.push(cm);
          }
        });

        setMovies(allUnique);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
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

  if (!person) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)'
        }}
      >
        <p>Person not found.</p>
      </div>
    );
  }

  const profileUrl = getActorAvatar(person.name, person.profile_path);

  const bio = person.biography || '';
  const bioLimit = 600;
  const isBioLong = bio.length > bioLimit;
  const displayedBio = isBioLong && !isBioExpanded ? `${bio.slice(0, bioLimit)}…` : bio;

  // Calculate age
  let birthFormatted = null;
  let age = null;
  if (person.birthday) {
    const bDate = new Date(person.birthday);
    birthFormatted = bDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (!person.deathday) {
      const today = new Date();
      age = today.getFullYear() - bDate.getFullYear();
      if (today < new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())) {
        age -= 1;
      }
    }
  }

  let deathFormatted = null;
  if (person.deathday) {
    const dDate = new Date(person.deathday);
    deathFormatted = dDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (person.birthday) {
      const bDate = new Date(person.birthday);
      age = dDate.getFullYear() - bDate.getFullYear();
      if (dDate < new Date(dDate.getFullYear(), bDate.getMonth(), bDate.getDate())) {
        age -= 1;
      }
    }
  }

  const imdbUrl = person.imdb_id ? `https://www.imdb.com/name/${person.imdb_id}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-raised)' }}
    >
      <div className="container-xl" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <div
          className="person-details-flex"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column: Photo & Personal Info */}
          <div className="person-left-col" style={{ width: '100%', maxWidth: '260px', flexShrink: 0 }}>
            <img
              src={profileUrl}
              alt={person.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = generateInitialsSvg(person.name);
              }}
              style={{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid var(--color-border-default)',
                boxShadow: 'var(--shadow-dialog)',
                marginBottom: '24px',
                aspectRatio: '2/3'
              }}
            />

            {/* Info Table */}
            <div>
              <h3 style={{ color: 'var(--color-text-tertiary)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
                Personal Info
              </h3>

              {person.known_for_department && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Known For
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>{person.known_for_department}</span>
                </div>
              )}

              {person.gender && GENDER_MAP[person.gender] && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Gender
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>{GENDER_MAP[person.gender]}</span>
                </div>
              )}

              {birthFormatted && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Born
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>
                    {birthFormatted}
                    {age !== null && !person.deathday && <span style={{ color: 'var(--color-text-secondary)' }}> ({age} years old)</span>}
                  </span>
                </div>
              )}

              {deathFormatted && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Died
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>
                    {deathFormatted}
                    {age !== null && <span style={{ color: 'var(--color-text-secondary)' }}> ({age} years old)</span>}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Place of Birth
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>{person.place_of_birth}</span>
                </div>
              )}

              {person.popularity && (
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>
                    Popularity Score
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>{person.popularity.toFixed(1)}</span>
                </div>
              )}

              {imdbUrl && (
                <div style={{ marginTop: '16px' }}>
                  <a
                    href={imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--color-accent)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View on IMDb <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Name, Bio & Filmography */}
          <div className="person-right-col" style={{ flex: 1, minWidth: '280px' }}>
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                lineHeight: 1.1,
                marginBottom: '8px'
              }}
            >
              {person.name}
            </h1>

            {person.known_for_department && (
              <div
                style={{
                  display: 'inline-block',
                  background: 'var(--color-accent-bg)',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent-border)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  marginBottom: '24px'
                }}
              >
                {person.known_for_department}
              </div>
            )}

            {/* Biography */}
            <div style={{ marginBottom: '40px' }}>
              <h2 className="section-title" style={{ marginBottom: '14px' }}>
                Biography
              </h2>
              {bio ? (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                    {displayedBio}
                  </p>
                  {isBioLong && (
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      style={{
                        marginTop: '8px',
                        color: 'var(--color-accent)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        padding: 0
                      }}
                    >
                      {isBioExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  No biography available for {person.name}.
                </p>
              )}
            </div>

            {/* Filmography Grid */}
            {movies.length > 0 && (
              <div>
                <h2 className="section-title" style={{ marginBottom: '20px' }}>
                  Filmography
                  <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, fontSize: '0.85rem' }}>
                    ({movies.length} titles)
                  </span>
                </h2>
                <div className="vertical-movie-grid">
                  {movies.map((m) => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <MovieCard movie={m} />
                      {m.character && (
                        <span
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.68rem',
                            marginTop: '4px',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                        >
                          as {m.character}
                        </span>
                      )}
                      {m.job && !m.character && (
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.68rem', marginTop: '4px' }}>
                          {m.job}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
