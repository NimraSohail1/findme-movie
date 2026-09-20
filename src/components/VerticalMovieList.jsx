import React from 'react';
import MovieCard from './MovieCard';

export default function VerticalMovieList({ movies = [], onWatchlistChange }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="vertical-movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onWatchlistChange={onWatchlistChange}
        />
      ))}
    </div>
  );
}
