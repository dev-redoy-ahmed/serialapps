// Database Configuration
export const DB_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial",
  DB_NAME: "banglaserial"
};

// API Endpoints
export const API_ENDPOINTS = {
  GET_ALL_DATA: "/api/get-all-data",
  CHANNELS: "/api/channels",
  ADMOB_ADS: "/api/admob-ads",
  EPISODES: "/api/episodes",
  NOTICES: "/api/notices",
  SERIALS: "/api/serials"
};

// Collection Names (based on actual database)
export const COLLECTIONS = {
  CHANNELS: "channels",
  ADMOB_ADS: "ads", // This exists as "ads"
  EPISODES: "episodes", // Additional collection found
  NOTICES: "notices", // Additional collection found
  SERIALS: "serials", // Additional collection found
  PREMIUM_PURCHASES: "premiumpurchases", // This exists
  APP_UPDATES: "appupdates" // Additional collection found
};

// Navigation items for sidebar
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/', icon: 'Home' },
  { name: 'Channels', href: '/channels', icon: 'Tv' },
  { name: 'Serials', href: '/serials', icon: 'Database' },
  { name: 'Episodes', href: '/episodes', icon: 'Play' },
  { name: 'Notices', href: '/notices', icon: 'Bell' },
  { name: 'AdMob Ads', href: '/admob-ads', icon: 'Smartphone' },
];