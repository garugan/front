import { type SearchResult } from '../components/data';
import { getAccessToken } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function searchRestaurants(query: string): Promise<SearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const url = new URL('/restaurants/search', apiBaseUrl);
  url.searchParams.set('q', normalizedQuery);

  const accessToken = getAccessToken();
  const response = await fetch(url, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  if (!response.ok) {
    throw new Error('お店の検索に失敗しました');
  }

  return response.json();
}
