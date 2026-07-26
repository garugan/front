import { type PlacePhoto, type Restaurant } from '../components/data';
import { getAccessToken } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function fetchRegisteredRestaurants(): Promise<Restaurant[]> {
  const url = new URL('/restaurants', apiBaseUrl);
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('登録済みのお店の取得に失敗しました');
  }

  return response.json();
}

export async function fetchRestaurantPhoto(
  placeId: string,
  signal?: AbortSignal,
): Promise<PlacePhoto | null> {
  const url = new URL('/restaurants/photo', apiBaseUrl);
  url.searchParams.set('id', placeId);
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('お店の写真の取得に失敗しました');
  }

  return response.json();
}

export async function saveRegisteredRestaurant(restaurant: Restaurant): Promise<Restaurant> {
  const url = new URL('/restaurants', apiBaseUrl);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurant),
  });

  if (!response.ok) {
    throw new Error('お店の保存に失敗しました');
  }

  return response.json();
}

function getAuthHeaders() {
  const accessToken = getAccessToken();

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}
