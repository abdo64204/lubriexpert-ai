declare global {
  interface Window {
    __ENV?: {
      API_URL?: string;
    };
  }
}

export const environment = {
  production: true,
  // If frontend and backend are hosted on the same domain/service:
  // apiUrl defaults to '/api'
  // If frontend is hosted separately (e.g. Vercel, Netlify, Firebase) from the backend:
  // update apiUrl to your public backend URL, e.g. 'https://your-backend.onrender.com/api'
  // Alternatively, window.__ENV.API_URL can be set at runtime without rebuilding.
  apiUrl:
    typeof window !== 'undefined' && window.__ENV?.API_URL
      ? window.__ENV.API_URL
      : '/api',
  appName: 'LubriExpert AI',
};

