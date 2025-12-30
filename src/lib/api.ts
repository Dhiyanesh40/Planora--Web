import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

// Helper for authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Auth
  auth: {
    signUp: async (email: string, password: string, fullName: string, role: string) => {
      return authFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role }),
      });
    },
    signIn: async (email: string, password: string) => {
      return authFetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    signOut: async () => {
      return authFetch('/api/auth/signout', { method: 'POST' });
    },
    getUser: async () => {
      return authFetch('/api/auth/user');
    },
    getSession: async () => {
      return authFetch('/api/auth/session');
    },
  },

  // Itineraries
  itineraries: {
    getAll: async () => {
      return authFetch('/api/itineraries');
    },
    getPublic: async () => {
      return fetch(`${API_URL}/api/itineraries/public`).then(res => res.json());
    },
    getById: async (id: string) => {
      return fetch(`${API_URL}/api/itineraries/${id}`).then(res => res.json());
    },
    create: async (data: any) => {
      return authFetch('/api/itineraries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return authFetch(`/api/itineraries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return authFetch(`/api/itineraries/${id}`, { method: 'DELETE' });
    },
  },

  // Activities
  activities: {
    getByItinerary: async (itineraryId: string) => {
      return fetch(`${API_URL}/api/activities/itinerary/${itineraryId}`).then(res => res.json());
    },
    create: async (data: any) => {
      return authFetch('/api/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    createBulk: async (activities: any[]) => {
      return authFetch('/api/activities/bulk', {
        method: 'POST',
        body: JSON.stringify({ activities }),
      });
    },
    update: async (id: string, data: any) => {
      return authFetch(`/api/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return authFetch(`/api/activities/${id}`, { method: 'DELETE' });
    },
    deleteByItinerary: async (itineraryId: string) => {
      return authFetch(`/api/activities/itinerary/${itineraryId}`, { method: 'DELETE' });
    },
  },

  // Profiles
  profiles: {
    getMe: async () => {
      return authFetch('/api/profiles/me');
    },
    getById: async (id: string) => {
      return fetch(`${API_URL}/api/profiles/${id}`).then(res => res.json());
    },
    updateMe: async (data: any) => {
      return authFetch('/api/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },
};
