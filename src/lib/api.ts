import API_BASE from '@/lib/api';
// Central API base URL — reads from env var in production, falls back to localhost in dev
const API_BASE = import.meta.env.VITE_API_URL || `${API_BASE}`;

export default API_BASE;
