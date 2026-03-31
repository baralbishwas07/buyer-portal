const API_BASE = import.meta.env.VITE_API_URL || '/api';

// For auth endpoints (login/register): no redirect needed
async function parseResponse(response) {
  return await response.json();
}

// For protected endpoints: try refresh on 401 before giving up
async function handleResponse(response, retryFn) {
  const data = await response.json();

  // If 401 and we have a retry function, attempt token refresh
  if (response.status === 401 && retryFn) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry the original request after refresh
      return await retryFn();
    }
    // Refresh failed, redirect to login
    window.location.href = '/';
    return data;
  }

  return data;
}

// Attempt to refresh the access token using refresh token cookie
async function refreshToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    return await parseResponse(response);
  } catch (error) {
    return { success: false, message: 'Network error. Is the server running?' };
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return await parseResponse(response);
  } catch (error) {
    return { success: false, message: 'Network error. Is the server running?' };
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Logout failed.' };
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });

    if (response.status === 401) {
      // Try refreshing token
      const refreshed = await refreshToken();
      if (refreshed) {
        const retryResponse = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });
        return await retryResponse.json();
      }
      return { success: false, message: 'Not authenticated.' };
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: 'Failed to fetch user.' };
  }
}

export async function fetchProperties() {
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Failed to load properties.' };
  }
}

export async function fetchFavourites() {
  async function doFetch() {
    const response = await fetch(`${API_BASE}/favourites`, {
      credentials: 'include',
    });
    return await response.json();
  }

  try {
    const response = await fetch(`${API_BASE}/favourites`, {
      credentials: 'include',
    });
    return await handleResponse(response, doFetch);
  } catch (error) {
    return { success: false, message: 'Failed to load favourites.' };
  }
}

export async function addFavourite(propertyId) {
  async function doFetch() {
    const response = await fetch(`${API_BASE}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ propertyId }),
    });
    return await response.json();
  }

  try {
    const response = await fetch(`${API_BASE}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ propertyId }),
    });
    return await handleResponse(response, doFetch);
  } catch (error) {
    return { success: false, message: 'Failed to add favourite.' };
  }
}

export async function removeFavourite(propertyId) {
  async function doFetch() {
    const response = await fetch(`${API_BASE}/favourites/${propertyId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await response.json();
  }

  try {
    const response = await fetch(`${API_BASE}/favourites/${propertyId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await handleResponse(response, doFetch);
  } catch (error) {
    return { success: false, message: 'Failed to remove favourite.' };
  }
}
