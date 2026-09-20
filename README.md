# 🎬 FindMe Movies — Modern Movie Discovery Web App

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TMDB API](https://img.shields.io/badge/TMDB-API_v3-01d277?style=for-the-badge&logo=themoviedatabase)](https://www.themoviedb.org/)
[![Theme](https://img.shields.io/badge/Theme-Royal_Purple-9333ea?style=for-the-badge)](https://github.com/NimraSohail1/findme-movie)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**FindMe Movies** is a modern, fast, and feature-rich movie discovery web application built with **React**, **Vite**, and the **TMDB API**. It features an elegant **Royal Purple** aesthetic with full **Light ☀️ and Dark 🌙 mode support**, smart regional cinema search, YouTube trailer playback, JustWatch streaming availability, and a personal watchlist.

---

## ✨ Features

### 🌓 Dual Theme System (Light & Dark Mode)
- **Instant Theme Switching**: Toggle seamlessly between dark and light themes from both desktop header and mobile drawer.
- **Persistent Memory**: Saves user preference in `localStorage`.
- **Royal Purple Identity**: Carefully calibrated WCAG 2.2 compliant high-contrast color palette in both dark (`#a855f7`) and light (`#9333ea`) modes.

### 🔍 Smart Live Search & Autocomplete
- **Instant Debounced Autocomplete**: Real-time dropdown showing movie posters, release years, and TMDB star ratings.
- **Regional Cinema Discovery**: Search for global and regional cinema terms like *Bollywood*, *Lollywood*, *Hollywood*, *Korean Dramas*, *Anime*, etc.

### 🎥 Featured Hero Slider & Carousels
- **Dynamic Backdrop Carousel**: Auto-advancing slider (6s interval) with pause on hover, backdrop shading, and pagination bullets.
- **Category Sliders**: Explore *Trending Today*, *In Theaters*, *Popular*, *Top Rated*, and *Upcoming Releases*.

### 🍿 Comprehensive Movie Details
- **Embedded Trailer Player**: Watch official HD trailers directly via YouTube modal with keyboard escape support.
- **Where to Watch (JustWatch)**: Live streaming availability for Subscription, Rent, and Buy options (Netflix, Prime Video, Apple TV, Disney+, etc.).
- **Top Cast & Crew**: View actor headshots with smart initial avatars fallback for missing photos.
- **Community Reviews & Recommendations**: Read user reviews with ratings and discover related films.
- **Social Sharing**: One-click URL copy with animated Toast feedback and native Web Share integration.

### 👤 Person / Actor Details
- Detailed actor biography, birth/death info, place of birth, popularity index, IMDb link, and full filmography.

### 🔖 Personal Watchlist
- Save favorite movies with local persistence across sessions.
- Dynamic navbar counter badge and quick remove/clear actions.

### 📱 100% Mobile Responsive
- Optimized for all screen sizes (mobile, tablet, desktop) with smooth touch momentum scrolling (`-webkit-overflow-scrolling: touch`) and custom high-visibility scrollbars.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Custom Properties (Theme Tokens)
- **Routing**: React Router DOM (v6)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios
- **Data Source**: [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/NimraSohail1/findme-movie.git
cd findme-movie
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```
> *(You can get a free API key from [The Movie Database](https://www.themoviedb.org/settings/api)).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📂 Project Structure

```text
findme-movie/
├── public/
│   └── _redirects          # Netlify SPA routing rules
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── HorizontalMovieList.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── Toast.jsx
│   │   ├── TrailerModal.jsx
│   │   └── VerticalMovieList.jsx
│   ├── context/
│   │   └── ThemeContext.jsx # Theme provider & useTheme hook
│   ├── pages/
│   │   ├── GenreMovies.jsx
│   │   ├── Home.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── NowPlaying.jsx
│   │   ├── PersonDetails.jsx
│   │   ├── Popular.jsx
│   │   ├── TopRated.jsx
│   │   ├── Trending.jsx
│   │   ├── Upcoming.jsx
│   │   └── Watchlist.jsx
│   ├── services/
│   │   └── tmdb.js          # TMDB API requests & helpers
│   ├── utils/
│   │   ├── imageHelper.js   # Poster & avatar SVG generator
│   │   └── recentlyViewed.js # LocalStorage history & watchlist
│   ├── App.jsx
│   ├── index.css            # Design tokens & responsive styles
│   └── main.jsx
├── vercel.json              # Vercel SPA rewrite config
├── vite.config.js
└── package.json
```

---

## 🌐 Deployment

### Deploy on Vercel
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `findme-movie` repository.
4. (Optional) Add your `VITE_TMDB_API_KEY` under **Environment Variables**.
5. Click **Deploy**.

### Deploy on Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder at [Netlify Drop](https://app.netlify.com/drop).

---

## 📄 License & Attribution

- This project is licensed under the MIT License.
- Film data, posters, and imagery provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Streaming platform data powered by [JustWatch](https://www.justwatch.com/).

---

Made with ❤️ by [Nimra Sohail](https://github.com/NimraSohail1)
