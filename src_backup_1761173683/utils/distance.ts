// Simplified US zip code to approximate coordinates mapping
// This is a basic implementation for prototype purposes
// In production, you'd use a proper geocoding API

interface ZipCodeCoordinates {
  [key: string]: { lat: number; lng: number };
}

// Sample zip code coordinates for major US cities/regions
// First 3 digits of zip code mapped to approximate center coordinates
const zipPrefixCoordinates: { [key: string]: { lat: number; lng: number } } = {
  '495': { lat: 42.9634, lng: -85.6681 }, // Grand Rapids, MI
  '490': { lat: 42.3314, lng: -83.0458 }, // Detroit, MI
  '600': { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
  '100': { lat: 40.7128, lng: -74.0060 }, // New York, NY
  '900': { lat: 34.0522, lng: -118.2437 }, // Los Angeles, CA
  '770': { lat: 33.7490, lng: -84.3880 }, // Atlanta, GA
  '750': { lat: 32.7767, lng: -96.7970 }, // Dallas, TX
  '980': { lat: 47.6062, lng: -122.3321 }, // Seattle, WA
  '850': { lat: 33.4484, lng: -112.0740 }, // Phoenix, AZ
  '191': { lat: 39.9526, lng: -75.1652 }, // Philadelphia, PA
  '021': { lat: 42.3601, lng: -71.0589 }, // Boston, MA
  '330': { lat: 25.7617, lng: -80.1918 }, // Miami, FL
  '800': { lat: 39.7392, lng: -104.9903 }, // Denver, CO
  '981': { lat: 45.5152, lng: -122.6784 }, // Portland, OR
  '890': { lat: 36.1699, lng: -115.1398 }, // Las Vegas, NV
};

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get approximate coordinates from zip code
export function getCoordinatesFromZip(zipCode: string): { lat: number; lng: number } | null {
  if (!zipCode || zipCode.length < 3) return null;
  
  const prefix = zipCode.substring(0, 3);
  return zipPrefixCoordinates[prefix] || null;
}

// Parse location string to get zip code or approximate location
export function parseLocation(location: string, zipCode?: string): { lat: number; lng: number } | null {
  // If we have a zip code, use it
  if (zipCode) {
    return getCoordinatesFromZip(zipCode);
  }
  
  // Otherwise try to extract state and use a default location for that state
  const stateDefaults: { [key: string]: { lat: number; lng: number } } = {
    'MI': { lat: 42.9634, lng: -85.6681 },
    'IL': { lat: 41.8781, lng: -87.6298 },
    'NY': { lat: 40.7128, lng: -74.0060 },
    'CA': { lat: 36.7783, lng: -119.4179 },
    'TX': { lat: 31.9686, lng: -99.9018 },
    'FL': { lat: 27.6648, lng: -81.5158 },
    'PA': { lat: 41.2033, lng: -77.1945 },
    'OH': { lat: 40.4173, lng: -82.9071 },
    'GA': { lat: 32.1656, lng: -82.9001 },
    'NC': { lat: 35.7596, lng: -79.0193 },
    'WA': { lat: 47.7511, lng: -120.7401 },
    'AZ': { lat: 34.0489, lng: -111.0937 },
    'MA': { lat: 42.4072, lng: -71.3824 },
    'CO': { lat: 39.5501, lng: -105.7821 },
    'OR': { lat: 43.8041, lng: -120.5542 },
    'NV': { lat: 38.8026, lng: -116.4194 },
  };

  // Try to extract state from location string (e.g., "Grand Rapids, MI")
  const parts = location.split(',');
  if (parts.length >= 2) {
    const state = parts[1].trim().toUpperCase();
    if (stateDefaults[state]) {
      return stateDefaults[state];
    }
  }

  return null;
}

// Get user's current location using browser geolocation API
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}
