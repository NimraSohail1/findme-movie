const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const WATCHLIST_KEY = 'findme_watchlist';
const MAX_RECENT = 10;

export function getRecentlyViewed() {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read recently viewed from localStorage', err);
    return [];
  }
}

export function saveRecentlyViewed(movie) {
  if (!movie || !movie.id) return;
  try {
    const list = getRecentlyViewed().filter(item => item.id !== movie.id);
    const updated = [
      {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      },
      ...list
    ].slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed to localStorage', err);
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (err) {
    console.error('Failed to clear recently viewed from localStorage', err);
  }
}

export function getWatchlist() {
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export function toggleWatchlist(movie) {
  if (!movie || !movie.id) return false;
  try {
    const list = getWatchlist();
    const exists = list.some(item => item.id === movie.id);
    let updated;
    if (exists) {
      updated = list.filter(item => item.id !== movie.id);
    } else {
      updated = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date
        },
        ...list
      ];
    }
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactive sync across components
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    return !exists;
  } catch (err) {
    return false;
  }
}

export function isInWatchlist(movieId) {
  try {
    const list = getWatchlist();
    return list.some(item => String(item.id) === String(movieId));
  } catch (err) {
    return false;
  }
}
