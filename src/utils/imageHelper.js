import { tmdbConfig } from '../services/tmdb';

// Known actor photo map for regional cinema & celebrities who might be missing photos on TMDB
const KNOWN_ACTOR_PHOTOS = {
  'Faris Shafi': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'Saima Baloch': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'Ali Azmat': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'Babar Ali': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'Resham': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'Saima Noor': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'Shaan Shahid': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'Sultan Rahi': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'Mustafa Qureshi': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'Ilyas Kashmiri': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
};

/**
 * Generates an ultra-crisp SVG data URI avatar with dark theme and gold accents
 */
export function generateInitialsSvg(name, subtitle = 'FINDME CAST') {
  const cleanName = (name || 'Actor').trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'A';

  const displayName = cleanName.length > 18 ? cleanName.slice(0, 16) + '…' : cleanName;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b" />
        <stop offset="100%" stop-color="#0c0c0e" />
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c084fc" />
        <stop offset="100%" stop-color="#a855f7" />
      </linearGradient>
    </defs>
    <rect width="300" height="400" fill="url(#bgGrad)" />
    <circle cx="150" cy="155" r="65" fill="#141417" stroke="url(#purpleGrad)" stroke-width="3.5" />
    <text x="150" y="172" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="44" font-weight="700" fill="url(#purpleGrad)" text-anchor="middle" dominant-baseline="central">${initials}</text>
    <text x="150" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="16" font-weight="700" fill="#fafafa" text-anchor="middle">${displayName}</text>
    <text x="150" y="296" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="11" font-weight="600" fill="#a855f7" text-anchor="middle" letter-spacing="1.5">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a high-res actor photo URL or a stylish, high-quality avatar with their name initials
 */
export function getActorAvatar(name, profilePath) {
  if (profilePath) {
    return `${tmdbConfig.profileBaseUrl}${profilePath}`;
  }
  if (name && KNOWN_ACTOR_PHOTOS[name]) {
    return KNOWN_ACTOR_PHOTOS[name];
  }
  return generateInitialsSvg(name);
}

/**
 * Generates a cinematic SVG poster placeholder when no poster image exists
 */
export function generatePosterSvg(title = 'Movie') {
  const cleanTitle = (title || 'Movie').trim();
  const initials = cleanTitle
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'M';

  const displayTitle = cleanTitle.length > 20 ? cleanTitle.slice(0, 18) + '…' : cleanTitle;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <defs>
      <linearGradient id="bgP" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1c20" />
        <stop offset="100%" stop-color="#0a0a0c" />
      </linearGradient>
      <linearGradient id="purpleP" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c084fc" />
        <stop offset="100%" stop-color="#a855f7" />
      </linearGradient>
    </defs>
    <rect width="300" height="450" fill="url(#bgP)" />
    <rect x="20" y="20" width="260" height="410" rx="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    <circle cx="150" cy="180" r="55" fill="#141417" stroke="url(#purpleP)" stroke-width="3" />
    <text x="150" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="36" font-weight="700" fill="url(#purpleP)" text-anchor="middle" dominant-baseline="central">${initials}</text>
    <text x="150" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">${displayTitle}</text>
    <text x="150" y="306" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif" font-size="11" font-weight="600" fill="#a855f7" text-anchor="middle" letter-spacing="2">FINDME MOVIES</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a movie poster URL or a cinematic branded placeholder
 */
export function getMoviePosterUrl(movie) {
  if (!movie) return generatePosterSvg('Movie');
  if (movie.poster_path) {
    return `${tmdbConfig.posterBaseUrl}${movie.poster_path}`;
  }
  return generatePosterSvg(movie.title || movie.name);
}

/**
 * Returns a movie backdrop URL or a dark backdrop fallback
 */
export function getMovieBackdropUrl(movie) {
  if (!movie) return null;
  if (movie.backdrop_path) {
    return `${tmdbConfig.backdropBaseUrl}${movie.backdrop_path}`;
  }
  if (movie.poster_path) {
    return `${tmdbConfig.posterBaseUrl}${movie.poster_path}`;
  }
  return null;
}
