import React from 'react';
import MovieCard from './MovieCard';

export default function HorizontalMovieList({ movies = [], onWatchlistChange }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="horizontal-scroll-container">
      <div className="horizontal-movie-row">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onWatchlistChange={onWatchlistChange}
          />
        ))}
      </div>
    </div>
  );
}
