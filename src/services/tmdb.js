import axios from 'axios';

// Live TMDB API configuration with environment variable
const TMDB_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY) ||
  'c45a857c193f6302f2b5061c3b85e743';
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('⚠️ VITE_TMDB_API_KEY is not defined. Please set it in your .env file or hosting environment variables.');
}

export const tmdbConfig = {
  posterBaseUrl: 'https://image.tmdb.org/t/p/w500',
  cardPosterBaseUrl: 'https://image.tmdb.org/t/p/w342',
  backdropBaseUrl: 'https://image.tmdb.org/t/p/original',
  profileBaseUrl: 'https://image.tmdb.org/t/p/w185',
  logoBaseUrl: 'https://image.tmdb.org/t/p/w92'
};

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  }
});

// Genre definitions
export const GENRES_LIST = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const GENRE_MAP = Object.fromEntries(
  GENRES_LIST.map((g) => [g.id, g.name])
);

// High-fidelity fallback movies so the screen is NEVER blank
const INITIAL_MOVIES = [
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 5120,
    genre_ids: [878, 12, 18],
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family."
  },
  {
    id: 872585,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cw69zbPQNsuyF11v6v4aNFm.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8900,
    genre_ids: [18, 36],
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTjA3R0jFYba16jBB1jv82EU.jpg",
    release_date: "2024-07-24",
    vote_average: 7.7,
    vote_count: 4200,
    genre_ids: [28, 35, 878],
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again."
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop_path: "/p5ozvmdgsmbWe0H8wf4NsSSKsNg.jpg",
    release_date: "2024-06-11",
    vote_average: 7.6,
    vote_count: 4700,
    genre_ids: [16, 10751, 12, 35],
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up."
  },
  {
    id: 912649,
    title: "Venom: The Last Dance",
    poster_path: "/aosm8Vh9il46gxEZNiV7KiBqq4C.jpg",
    backdrop_path: "/3V4kSt3a36ElHHa6QIflikjJv8g.jpg",
    release_date: "2024-10-22",
    vote_average: 6.8,
    vote_count: 1800,
    genre_ids: [28, 878, 12],
    overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance."
  },
  {
    id: 558449,
    title: "Gladiator II",
    poster_path: "/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop_path: "/euYIwmwkmz95mnXvufEmbL6ovhC.jpg",
    release_date: "2024-11-13",
    vote_average: 6.8,
    vote_count: 1550,
    genre_ids: [28, 12, 18],
    overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist."
  },
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34500,
    genre_ids: [12, 18, 878],
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage."
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 35000,
    genre_ids: [28, 878, 12],
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\"."
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 31000,
    genre_ids: [18, 28, 80, 53],
    overview: "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets."
  }
];

// Map of country names, cinema industries, languages & regions for smart discovery
const COUNTRY_INDUSTRY_QUERY_MAP = {
  // Pakistan & Lollywood
  'pakistan': { with_origin_country: 'PK', sort_by: 'popularity.desc' },
  'pakistani': { with_origin_country: 'PK', sort_by: 'popularity.desc' },
  'pakistani movies': { with_origin_country: 'PK', sort_by: 'popularity.desc' },
  'lollywood': { with_origin_country: 'PK', sort_by: 'popularity.desc' },
  'urdu': { with_original_language: 'ur', sort_by: 'popularity.desc' },
  'urdu movies': { with_original_language: 'ur', sort_by: 'popularity.desc' },
  'lahore': { with_origin_country: 'PK', sort_by: 'popularity.desc' },
  'karachi': { with_origin_country: 'PK', sort_by: 'popularity.desc' },

  // India & Regional Indian Cinemas
  'bollywood': { with_origin_country: 'IN', with_original_language: 'hi', sort_by: 'popularity.desc' },
  'india': { with_origin_country: 'IN', sort_by: 'popularity.desc' },
  'indian': { with_origin_country: 'IN', sort_by: 'popularity.desc' },
  'indian movies': { with_origin_country: 'IN', sort_by: 'popularity.desc' },
  'hindi': { with_original_language: 'hi', sort_by: 'popularity.desc' },
  'hindi movies': { with_original_language: 'hi', sort_by: 'popularity.desc' },
  'tollywood': { with_origin_country: 'IN', with_original_language: 'te', sort_by: 'popularity.desc' },
  'telugu': { with_original_language: 'te', sort_by: 'popularity.desc' },
  'telugu movies': { with_original_language: 'te', sort_by: 'popularity.desc' },
  'kollywood': { with_origin_country: 'IN', with_original_language: 'ta', sort_by: 'popularity.desc' },
  'tamil': { with_original_language: 'ta', sort_by: 'popularity.desc' },
  'tamil movies': { with_original_language: 'ta', sort_by: 'popularity.desc' },
  'mollywood': { with_origin_country: 'IN', with_original_language: 'ml', sort_by: 'popularity.desc' },
  'malayalam': { with_original_language: 'ml', sort_by: 'popularity.desc' },
  'sandalwood': { with_origin_country: 'IN', with_original_language: 'kn', sort_by: 'popularity.desc' },
  'kannada': { with_original_language: 'kn', sort_by: 'popularity.desc' },
  'pollywood': { with_original_language: 'pa', sort_by: 'popularity.desc' },
  'punjabi': { with_original_language: 'pa', sort_by: 'popularity.desc' },
  'punjabi movies': { with_original_language: 'pa', sort_by: 'popularity.desc' },

  // USA & Hollywood
  'hollywood': { with_origin_country: 'US', with_original_language: 'en', sort_by: 'popularity.desc' },
  'usa': { with_origin_country: 'US', sort_by: 'popularity.desc' },
  'america': { with_origin_country: 'US', sort_by: 'popularity.desc' },
  'american': { with_origin_country: 'US', sort_by: 'popularity.desc' },
  'us movies': { with_origin_country: 'US', sort_by: 'popularity.desc' },
  'united states': { with_origin_country: 'US', sort_by: 'popularity.desc' },

  // South Korea & K-Drama
  'korea': { with_origin_country: 'KR', sort_by: 'popularity.desc' },
  'korean': { with_origin_country: 'KR', sort_by: 'popularity.desc' },
  'korean movies': { with_origin_country: 'KR', sort_by: 'popularity.desc' },
  'south korea': { with_origin_country: 'KR', sort_by: 'popularity.desc' },
  'k-drama': { with_origin_country: 'KR', sort_by: 'popularity.desc' },
  'kdrama': { with_origin_country: 'KR', sort_by: 'popularity.desc' },

  // Japan & Anime
  'japan': { with_origin_country: 'JP', sort_by: 'popularity.desc' },
  'japanese': { with_origin_country: 'JP', sort_by: 'popularity.desc' },
  'japanese movies': { with_origin_country: 'JP', sort_by: 'popularity.desc' },
  'anime': { with_origin_country: 'JP', with_genres: '16', sort_by: 'popularity.desc' },

  // Turkey & Turkish Dizi
  'turkey': { with_origin_country: 'TR', sort_by: 'popularity.desc' },
  'turkish': { with_origin_country: 'TR', sort_by: 'popularity.desc' },
  'turkish movies': { with_origin_country: 'TR', sort_by: 'popularity.desc' },
  'dizi': { with_origin_country: 'TR', sort_by: 'popularity.desc' },

  // United Kingdom & British Cinema
  'uk': { with_origin_country: 'GB', sort_by: 'popularity.desc' },
  'united kingdom': { with_origin_country: 'GB', sort_by: 'popularity.desc' },
  'britain': { with_origin_country: 'GB', sort_by: 'popularity.desc' },
  'british': { with_origin_country: 'GB', sort_by: 'popularity.desc' },
  'british movies': { with_origin_country: 'GB', sort_by: 'popularity.desc' },
  'england': { with_origin_country: 'GB', sort_by: 'popularity.desc' },

  // France & French
  'france': { with_origin_country: 'FR', sort_by: 'popularity.desc' },
  'french': { with_origin_country: 'FR', sort_by: 'popularity.desc' },
  'french movies': { with_origin_country: 'FR', sort_by: 'popularity.desc' },

  // Spain & Spanish / Latin
  'spain': { with_origin_country: 'ES', sort_by: 'popularity.desc' },
  'spanish': { with_original_language: 'es', sort_by: 'popularity.desc' },
  'spanish movies': { with_original_language: 'es', sort_by: 'popularity.desc' },
  'latino': { with_origin_country: 'ES|MX|AR|CO', with_original_language: 'es', sort_by: 'popularity.desc' },

  // Germany & German
  'germany': { with_origin_country: 'DE', sort_by: 'popularity.desc' },
  'german': { with_origin_country: 'DE', sort_by: 'popularity.desc' },
  'german movies': { with_origin_country: 'DE', sort_by: 'popularity.desc' },

  // Italy & Italian
  'italy': { with_origin_country: 'IT', sort_by: 'popularity.desc' },
  'italian': { with_origin_country: 'IT', sort_by: 'popularity.desc' },
  'italian movies': { with_origin_country: 'IT', sort_by: 'popularity.desc' },

  // China & Hong Kong
  'china': { with_origin_country: 'CN', sort_by: 'popularity.desc' },
  'chinese': { with_original_language: 'zh', sort_by: 'popularity.desc' },
  'chinese movies': { with_original_language: 'zh', sort_by: 'popularity.desc' },
  'hong kong': { with_origin_country: 'HK', sort_by: 'popularity.desc' },
  'taiwan': { with_origin_country: 'TW', sort_by: 'popularity.desc' },

  // Iran & Persian
  'iran': { with_origin_country: 'IR', sort_by: 'popularity.desc' },
  'iranian': { with_origin_country: 'IR', sort_by: 'popularity.desc' },
  'iranian movies': { with_origin_country: 'IR', sort_by: 'popularity.desc' },
  'persian': { with_original_language: 'fa', sort_by: 'popularity.desc' },

  // Middle East & Arabic
  'arabic': { with_original_language: 'ar', sort_by: 'popularity.desc' },
  'arab': { with_original_language: 'ar', sort_by: 'popularity.desc' },
  'egypt': { with_origin_country: 'EG', sort_by: 'popularity.desc' },
  'egyptian': { with_origin_country: 'EG', sort_by: 'popularity.desc' },

  // Nigeria & Nollywood
  'nollywood': { with_origin_country: 'NG', sort_by: 'popularity.desc' },
  'nigeria': { with_origin_country: 'NG', sort_by: 'popularity.desc' },
  'nigerian': { with_origin_country: 'NG', sort_by: 'popularity.desc' },

  // Russia
  'russia': { with_origin_country: 'RU', sort_by: 'popularity.desc' },
  'russian': { with_origin_country: 'RU', sort_by: 'popularity.desc' },

  // Thailand & Indonesia
  'thailand': { with_origin_country: 'TH', sort_by: 'popularity.desc' },
  'thai': { with_origin_country: 'TH', sort_by: 'popularity.desc' },
  'indonesia': { with_origin_country: 'ID', sort_by: 'popularity.desc' },
  'indonesian': { with_origin_country: 'ID', sort_by: 'popularity.desc' },

  // Canada, Australia, Brazil, Mexico
  'canada': { with_origin_country: 'CA', sort_by: 'popularity.desc' },
  'canadian': { with_origin_country: 'CA', sort_by: 'popularity.desc' },
  'australia': { with_origin_country: 'AU', sort_by: 'popularity.desc' },
  'australian': { with_origin_country: 'AU', sort_by: 'popularity.desc' },
  'brazil': { with_origin_country: 'BR', sort_by: 'popularity.desc' },
  'brazilian': { with_origin_country: 'BR', sort_by: 'popularity.desc' },
  'mexico': { with_origin_country: 'MX', sort_by: 'popularity.desc' },
  'mexican': { with_origin_country: 'MX', sort_by: 'popularity.desc' }
};

export const tmdbService = {
  // Discover / Featured Hero Movies
  async discoverMovies() {
    try {
      const res = await api.get('/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          include_adult: false,
          page: 1
        }
      });
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES };
    } catch (err) {
      console.warn('Using fallback discover movies', err);
      return { results: INITIAL_MOVIES };
    }
  },

  // Trending Movies
  async getTrendingMovies(timeWindow = 'day') {
    try {
      const res = await api.get(`/trending/movie/${timeWindow}`);
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES };
    } catch (err) {
      console.warn('Using fallback trending movies', err);
      return { results: INITIAL_MOVIES };
    }
  },

  // Popular Movies
  async getPopularMovies(page = 1) {
    try {
      const res = await api.get('/movie/popular', { params: { page } });
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    } catch (err) {
      console.warn('Using fallback popular movies', err);
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    }
  },

  // Top Rated Movies
  async getTopRatedMovies(page = 1) {
    try {
      const res = await api.get('/movie/top_rated', { params: { page } });
      if (res.data?.results?.length > 0) return res.data;
      return { results: [...INITIAL_MOVIES].reverse(), page: 1, total_pages: 5 };
    } catch (err) {
      console.warn('Using fallback top rated movies', err);
      return { results: [...INITIAL_MOVIES].reverse(), page: 1, total_pages: 5 };
    }
  },

  // Upcoming Movies
  async getUpcomingMovies(page = 1) {
    try {
      const res = await api.get('/movie/upcoming', { params: { page } });
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    } catch (err) {
      console.warn('Using fallback upcoming movies', err);
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    }
  },

  // Now Playing Movies
  async getNowPlayingMovies(page = 1) {
    try {
      const res = await api.get('/movie/now_playing', { params: { page } });
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    } catch (err) {
      console.warn('Using fallback now playing movies', err);
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    }
  },

  // Movie Details by ID
  async getMovieById(id) {
    try {
      const res = await api.get(`/movie/${id}`);
      if (res.data) return res.data;
      return INITIAL_MOVIES.find((m) => String(m.id) === String(id)) || INITIAL_MOVIES[0];
    } catch (err) {
      console.warn('Using fallback movie detail', err);
      return INITIAL_MOVIES.find((m) => String(m.id) === String(id)) || INITIAL_MOVIES[0];
    }
  },

  // Movie Credits (Cast & Crew)
  async getMovieCredits(id) {
    try {
      const res = await api.get(`/movie/${id}/credits`);
      return res.data;
    } catch (err) {
      return {
        cast: [
          { id: 1190668, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
          { id: 505710, name: "Zendaya", character: "Chani", profile_path: "/rW70ihj00u6kLqR0n0p5t0WqjA8.jpg" },
          { id: 934, name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "/6NRubqiqB7688NnJz29GgA0p55C.jpg" }
        ],
        crew: [
          { id: 137427, name: "Denis Villeneuve", job: "Director" },
          { id: 137427, name: "Denis Villeneuve", job: "Writer" }
        ]
      };
    }
  },

  // Movie Videos (Trailers)
  async getMovieVideos(id) {
    try {
      const res = await api.get(`/movie/${id}/videos`);
      return res.data;
    } catch (err) {
      return {
        results: [
          { id: "1", key: "Way9Dexny3w", name: "Official Trailer", site: "YouTube", type: "Trailer" }
        ]
      };
    }
  },

  // Watch Providers (JustWatch)
  async getMovieWatchProviders(id) {
    try {
      const res = await api.get(`/movie/${id}/watch/providers`);
      return res.data;
    } catch (err) {
      return {
        results: {
          US: {
            flatrate: [
              { provider_id: 8, provider_name: "Netflix", logo_path: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
              { provider_id: 9, provider_name: "Amazon Prime Video", logo_path: "/emthp39XA2zhcoYLK2ImflATurL.jpg" },
              { provider_id: 1899, provider_name: "Max", logo_path: "/fksCUZ9QDWZMUwL2LgfqSTY6OB.jpg" }
            ],
            rent: [
              { provider_id: 2, provider_name: "Apple TV", logo_path: "/peURlLlr8jggOwK53fJ5wdQl05y.jpg" }
            ],
            buy: [
              { provider_id: 2, provider_name: "Apple TV", logo_path: "/peURlLlr8jggOwK53fJ5wdQl05y.jpg" }
            ]
          }
        }
      };
    }
  },

  // Keywords
  async getMovieKeywords(id) {
    try {
      const res = await api.get(`/movie/${id}/keywords`);
      return res.data;
    } catch (err) {
      return {
        keywords: [
          { id: 818, name: "space opera" },
          { id: 4565, name: "dystopia" },
          { id: 180547, name: "desert planet" }
        ]
      };
    }
  },

  // Reviews
  async getMovieReviews(id) {
    try {
      const res = await api.get(`/movie/${id}/reviews`);
      return res.data;
    } catch (err) {
      return {
        results: [
          {
            id: "rev1",
            author: "CinemaLover",
            content: "An absolute visual masterpiece! The scale, sound design, and acting performances are unmatched.",
            created_at: "2024-03-05T14:22:18.000Z",
            author_details: { rating: 9 }
          }
        ]
      };
    }
  },

  // Recommended Movies
  async getRecommendedMovies(id) {
    try {
      const res = await api.get(`/movie/${id}/recommendations`);
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES.slice(1, 7) };
    } catch (err) {
      return { results: INITIAL_MOVIES.slice(1, 7) };
    }
  },

  // Person Details
  async getPersonDetails(id) {
    try {
      const res = await api.get(`/person/${id}`);
      return res.data;
    } catch (err) {
      return {
        id,
        name: "Timothée Chalamet",
        biography: "Timothée Hal Chalamet is an American actor known for his roles in major feature films.",
        birthday: "1995-12-27",
        deathday: null,
        place_of_birth: "New York City, New York, USA",
        known_for_department: "Acting",
        gender: 2,
        popularity: 84.5,
        profile_path: "/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
        imdb_id: "nm3154303"
      };
    }
  },

  // Person Movies
  async getPersonMovies(id) {
    try {
      const res = await api.get(`/person/${id}/movie_credits`);
      if (res.data?.cast?.length > 0) return res.data;
      return { cast: INITIAL_MOVIES, crew: [] };
    } catch (err) {
      return { cast: INITIAL_MOVIES, crew: [] };
    }
  },

  // Discover by Genre
  async discoverByGenre(genreId, page = 1, sortBy = 'popularity.desc') {
    try {
      const res = await api.get('/discover/movie', {
        params: {
          with_genres: genreId,
          sort_by: sortBy,
          page
        }
      });
      if (res.data?.results?.length > 0) return res.data;
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    } catch (err) {
      return { results: INITIAL_MOVIES, page: 1, total_pages: 5 };
    }
  },



  // Live Smart Search (Handles titles, countries, Bollywood, Lollywood, Anime, etc.)
  async searchMovies(query) {
    if (!query || !query.trim()) return { results: [] };
    const cleanQuery = query.toLowerCase().trim();
    const matchedDiscoverParams = COUNTRY_INDUSTRY_QUERY_MAP[cleanQuery];

    try {
      const fetchPromises = [
        api.get('/search/movie', {
          params: { query: query.trim(), include_adult: false }
        })
      ];

      if (matchedDiscoverParams) {
        fetchPromises.push(
          api.get('/discover/movie', {
            params: {
              ...matchedDiscoverParams,
              include_adult: false,
              page: 1
            }
          })
        );
      }

      const responses = await Promise.all(fetchPromises);
      const combined = [];
      const seenIds = new Set();

      responses.forEach((res) => {
        const list = res.data?.results || [];
        list.forEach((movie) => {
          if (!seenIds.has(movie.id)) {
            seenIds.add(movie.id);
            combined.push(movie);
          }
        });
      });

      // Sort by popularity if country/industry keyword matched
      if (matchedDiscoverParams) {
        combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }

      if (combined.length > 0) {
        return { results: combined };
      }

      const filtered = INITIAL_MOVIES.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered };
    } catch (err) {
      console.error('Search error:', err);
      const filtered = INITIAL_MOVIES.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered };
    }
  },

  // Genres List
  getGenres() {
    return GENRES_LIST;
  }
};

export default tmdbService;
