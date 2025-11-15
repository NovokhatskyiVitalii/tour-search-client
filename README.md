# 🏖️ Tour Search Client

A modern React application for searching and browsing tour offers with hotel information, built with TypeScript, Redux Toolkit, and Vite.

## 🌐 Live Demo

**👉 [View Live Demo](https://earnest-biscochitos-9a1a8c.netlify.app/)**

The application is deployed on Netlify and available at: https://earnest-biscochitos-9a1a8c.netlify.app/

## ✨ Features

- **🔍 Smart Search**: Autocomplete destination search with support for countries, cities, and hotels
- **📊 Tour Results**: Display search results as responsive cards with hotel information
- **🏨 Tour Details**: Detailed tour information page with hotel description, services, and pricing
- **⚡ Real-time Search**: Asynchronous search with polling and retry mechanisms
- **🔄 Search Management**: Cancel and restart search functionality
- **💾 Persistent Storage**: Prices with hotel information preserved in localStorage after page refresh
- **📱 Responsive Design**: Mobile-friendly UI with modern styling

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **SCSS** - Styling
- **ESLint** - Code linting

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/NovokhatskyiVitalii/tour-search-client.git
cd tour-search-client
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── app/              # App configuration
│   ├── hooks.ts      # Typed Redux hooks
│   ├── router.tsx    # React Router configuration
│   ├── routes.ts     # Route constants
│   └── store.ts      # Redux store setup
├── features/         # Feature modules
│   └── search/       # Search feature
│       ├── components/    # React components
│       ├── hooks/         # Custom hooks
│       ├── slices/        # Redux slices
│       ├── utils/         # Utility functions
│       └── types.ts       # TypeScript types
├── pages/            # Page components
│   ├── search/       # Search page
│   └── tour/         # Tour details page
├── scss/             # Global styles
│   ├── base/         # Base styles (reset, typography)
│   ├── utils/        # SCSS utilities (variables, mixins)
│   └── global.scss   # Global stylesheet
├── shared/           # Shared utilities
│   └── hooks/        # Shared custom hooks
├── types/            # Global TypeScript types
└── ui/               # UI components
    └── layout/       # Layout components
```

## 🔌 API

The application uses a mock API (`api.js`) that simulates backend functionality. All API functions return `Promise<Response>` similar to `fetch`.

### Available Endpoints

- `getCountries()` - Get list of countries
- `searchGeo(query)` - Search for countries, cities, or hotels
- `startSearchPrices(countryID)` - Start tour price search
- `getSearchPrices(token)` - Get search results (with polling support)
- `stopSearchPrices(token)` - Cancel active search
- `getHotels(countryID)` - Get hotels by country
- `getHotel(hotelId)` - Get hotel details
- `getPrice(priceId)` - Get price offer details

For detailed API documentation, see [docs-api.md](./docs-api.md).

## 🎯 Key Features Implementation

### Search Flow

1. User selects destination (country, city, or hotel)
2. Search is initiated with `startSearchPrices`
3. System polls for results using `getSearchPrices` with retry logic
4. Results are displayed as cards with hotel information
5. User can click on a tour to view detailed information

### Search Cancellation

- Previous searches are automatically cancelled when a new search starts
- Uses `stopSearchPrices` API to cancel active searches
- Implements race condition protection to ignore results from cancelled searches

### Data Persistence

- Prices with hotel information are stored in localStorage
- Tour details page works correctly after page refresh
- Hotel information is preserved even when searches are cancelled

## 🧪 Code Quality

Run linter:

```bash
npm run lint
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Netlify

The easiest way to deploy is using Netlify:

#### Option 1: Deploy via Netlify UI (Recommended)

1. **Sign up/Login** to [Netlify](https://www.netlify.com/)
2. **Connect your GitHub repository**:
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify will automatically detect the build settings from `netlify.toml`
3. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Your site will be available at `https://your-site-name.netlify.app`

#### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:

```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:

```bash
netlify login
```

3. **Initialize and deploy**:

```bash
netlify init
netlify deploy --prod
```

#### Netlify Configuration

The project includes `netlify.toml` with the following settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **SPA routing**: All routes redirect to `index.html` for client-side routing

### Other Deployment Options

- **Vercel**: Import project and deploy (automatic detection)
- **GitHub Pages**: Use GitHub Actions for deployment
- **Any static host**: Upload the `dist/` folder after running `npm run build`

### Build Output

The production build is generated in the `dist/` directory and can be served by any static file server.

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 👤 Author

**Vitalii Novokhatskyi**

- GitHub: [@NovokhatskyiVitalii](https://github.com/NovokhatskyiVitalii)

---

Made with ❤️ using React and TypeScript
