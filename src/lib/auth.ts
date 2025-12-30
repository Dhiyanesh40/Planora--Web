/**
 * Get authentication token from localStorage
 * @returns The access token or null if not found
 */
export const getAuthToken = (): string | null => {
  try {
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      return parsedSession.access_token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};
