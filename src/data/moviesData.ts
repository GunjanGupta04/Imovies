import { Movie, Showtime, SnackItem } from '../types';

export const HERO_BANNER_IMG = '/src/assets/images/hero_cinema_banner_1793178099131.jpg';

export const MOVIES_DATA: Movie[] = [
  {
    id: 'mov-1',
    title: 'Interstellar Odyssey',
    tagline: 'Lost in the void. Driven by hope.',
    synopsis: 'When a gravitational anomaly opens a gateway near Saturn, an elite expeditionary crew ventures past the event horizon into unexplored quantum sectors. As time dilates and resource margins collapse, commander Elara Vance must decide between saving the remaining crew or returning the critical celestial coordinates back to Earth.',
    duration: 168,
    rating: 9.4,
    certification: 'PG-13',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    releaseDate: 'October 2026',
    director: 'Elias Thorne',
    cast: ['Elara Vance', 'Julianne Croft', 'Mateo Rossi', 'Kenjiro Hagiwara'],
    languages: ['English', 'Spanish', 'Japanese'],
    formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D'],
    posterUrl: '/src/assets/images/poster_interstellar_odyssey_1793178099661.jpg',
    backdropUrl: HERO_BANNER_IMG,
    bannerTag: 'Critically Acclaimed'
  },
  {
    id: 'mov-2',
    title: 'Chroma: Noir',
    tagline: 'Night falls. The hunt begins.',
    synopsis: 'In a rain-drenched neon metropolis governed by synthetic memory cartels, a disgraced cyber-detective uncovers an illegal neural replication ring. Hunted by biomechanical enforcers across towering sky-bridges and underground speakeasies, he races to extract the one memory that could shatter the corporate regime.',
    duration: 142,
    rating: 8.9,
    certification: 'R',
    genres: ['Action', 'Thriller', 'Cyberpunk'],
    releaseDate: 'September 2026',
    director: 'Kalen Brrney',
    cast: ['Elias Thorne', 'Luna Chen', 'Detective Ninge', 'Klaus Vance'],
    languages: ['English', 'Mandarin'],
    formats: ['Dolby Atmos', '4DX', 'Standard 2D'],
    posterUrl: '/src/assets/images/poster_neon_chronicles_1793178100264.jpg',
    backdropUrl: HERO_BANNER_IMG,
    bannerTag: 'Box Office #1'
  },
  {
    id: 'mov-3',
    title: 'The Chronicles of Eldoria',
    tagline: 'The Stag of the Twin Moons has awakened.',
    synopsis: 'Ancient prophecies awaken when the mythical golden stag appears on the misty cliffs of Mount Eldor under the celestial convergence of the twin moons. An unexpected orphan scholar and a renegade guardian must guide the creature across perilous kingdoms before shadow harvesters extinguish its sacred light forever.',
    duration: 154,
    rating: 9.1,
    certification: 'PG-13',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    releaseDate: 'November 2026',
    director: 'Elara Vance',
    cast: ['Soren Valen', 'Lyra Silvers', 'Bram Stone', 'Rowan Thorne'],
    languages: ['English', 'French', 'German'],
    formats: ['IMAX 3D', 'Dolby Atmos', '4DX'],
    posterUrl: '/src/assets/images/poster_mythic_realms_1793178100484.jpg',
    backdropUrl: HERO_BANNER_IMG,
    bannerTag: 'Must Watch in IMAX'
  },
  {
    id: 'mov-4',
    title: 'Quantum Horizon',
    tagline: 'Reality is merely a prototype.',
    synopsis: 'At the world’s most secure subatomic particle accelerator facility in the Swiss Alps, an experiment penetrates the fourth dimension. When temporal anomalies begin fracturing the facility into alternating timelines, the lead physicists must outwit alternate iterations of themselves to prevent a vacuum decay collapse.',
    duration: 135,
    rating: 8.7,
    certification: 'PG-13',
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    releaseDate: 'October 2026',
    director: 'Sarah Jenkins',
    cast: ['David Chen', 'Anya Volkova', 'Julian Croft', 'Amara Bell'],
    languages: ['English', 'German'],
    formats: ['Dolby Atmos', 'Standard 2D'],
    posterUrl: '/src/assets/images/poster_interstellar_odyssey_1793178099661.jpg',
    backdropUrl: HERO_BANNER_IMG,
    bannerTag: 'Director Cut'
  }
];

export const THEATRES_LIST = [
  { id: 'th-1', name: 'IMovies Cineplex Grand', city: 'Metropolis Core', distance: '1.2 km' },
  { id: 'th-2', name: 'IMovies IMAX Laser Dome', city: 'Westside Arts District', distance: '3.8 km' },
  { id: 'th-3', name: 'IMovies Starlight Lounge & Dining', city: 'Skyline Terrace', distance: '5.1 km' }
];

export const INITIAL_SHOWTIMES: Showtime[] = [
  {
    id: 'st-101',
    movieId: 'mov-1',
    theatreId: 'th-1',
    theatreName: 'IMovies Cineplex Grand',
    screenName: 'Auditorium 1 (Laser IMAX)',
    screenType: 'IMAX Laser',
    date: 'Today',
    time: '14:30',
    basePrice: 18.50,
    availableSeatsCount: 64,
    totalSeatsCount: 80
  },
  {
    id: 'st-102',
    movieId: 'mov-1',
    theatreId: 'th-1',
    theatreName: 'IMovies Cineplex Grand',
    screenName: 'Auditorium 1 (Laser IMAX)',
    screenType: 'IMAX Laser',
    date: 'Today',
    time: '18:15',
    basePrice: 21.00,
    availableSeatsCount: 38,
    totalSeatsCount: 80
  },
  {
    id: 'st-103',
    movieId: 'mov-1',
    theatreId: 'th-2',
    theatreName: 'IMovies IMAX Laser Dome',
    screenName: 'Screen 4 (Dolby Cinema)',
    screenType: 'Dolby Cinema',
    date: 'Today',
    time: '21:30',
    basePrice: 22.50,
    availableSeatsCount: 52,
    totalSeatsCount: 80
  },
  {
    id: 'st-201',
    movieId: 'mov-2',
    theatreId: 'th-1',
    theatreName: 'IMovies Cineplex Grand',
    screenName: 'Auditorium 3 (4DX Dynamic)',
    screenType: 'ScreenX',
    date: 'Today',
    time: '16:00',
    basePrice: 19.00,
    availableSeatsCount: 45,
    totalSeatsCount: 80
  },
  {
    id: 'st-202',
    movieId: 'mov-2',
    theatreId: 'th-3',
    theatreName: 'IMovies Starlight Lounge & Dining',
    screenName: 'VIP Lounge Hall 2',
    screenType: 'Dolby Cinema',
    date: 'Today',
    time: '20:00',
    basePrice: 24.00,
    availableSeatsCount: 22,
    totalSeatsCount: 80
  },
  {
    id: 'st-301',
    movieId: 'mov-3',
    theatreId: 'th-1',
    theatreName: 'IMovies Cineplex Grand',
    screenName: 'Auditorium 2 (IMAX Dual)',
    screenType: 'IMAX Laser',
    date: 'Today',
    time: '15:15',
    basePrice: 20.00,
    availableSeatsCount: 58,
    totalSeatsCount: 80
  },
  {
    id: 'st-302',
    movieId: 'mov-3',
    theatreId: 'th-2',
    theatreName: 'IMovies IMAX Laser Dome',
    screenName: 'Grand Screen 1',
    screenType: 'IMAX Laser',
    date: 'Today',
    time: '19:45',
    basePrice: 22.00,
    availableSeatsCount: 29,
    totalSeatsCount: 80
  },
  {
    id: 'st-401',
    movieId: 'mov-4',
    theatreId: 'th-1',
    theatreName: 'IMovies Cineplex Grand',
    screenName: 'Screen 5 (Dolby 4K)',
    screenType: 'Dolby Cinema',
    date: 'Today',
    time: '17:30',
    basePrice: 17.50,
    availableSeatsCount: 62,
    totalSeatsCount: 80
  }
];

export const SNACKS_MENU: SnackItem[] = [
  {
    id: 'snk-1',
    name: 'Artisan Truffle & Butter Popcorn',
    category: 'popcorn',
    price: 8.50,
    description: 'Freshly popped warm corn dusted with white truffle salt and aged clarified butter.',
    icon: '🍿'
  },
  {
    id: 'snk-2',
    name: 'Caramel Glazed Gourmet Tub',
    category: 'popcorn',
    price: 7.50,
    description: 'Crunchy jumbo kernels enveloped in velvety brown butter caramel.',
    icon: '🍿'
  },
  {
    id: 'snk-3',
    name: 'Nitro Cold Brew & Gelato Float',
    category: 'beverage',
    price: 6.50,
    description: 'Single-origin Ethiopian cold brew infused with pure nitrogen topped with vanilla bean cream.',
    icon: '🥤'
  },
  {
    id: 'snk-4',
    name: 'Sparkling Blood Orange Soda',
    category: 'beverage',
    price: 5.00,
    description: 'Craft sparkling mineral soda with Sicilian organic blood orange reduction.',
    icon: '🍹'
  },
  {
    id: 'snk-5',
    name: 'Ultimate Cinema VIP Combo',
    category: 'combo',
    price: 16.00,
    description: '1 Large Truffle Popcorn + 2 Large Artisan Drinks + Loaded Jalapeno Nachos.',
    icon: '✨'
  }
];
