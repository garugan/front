export interface Restaurant {
  id: string;
  name: string;
  photo: string;
  status: 'visited' | 'want';
  rating: number;
  visitDate?: string;
  memo: string;
  floor: '1F' | '2F+';
  elevator: 'yes' | 'no' | 'unknown';
  category: string;
  address: string;
}

export interface PlacePhoto {
  url: string;
  authorAttributions: Array<{
    displayName: string;
    uri?: string;
    photoUri?: string;
  }>;
  googleMapsUri: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  restaurantCount: number;
  recentRestaurant: Restaurant | null;
}

export interface FriendDetails {
  id: string;
  name: string;
  email: string;
  restaurantCount: number;
  restaurants: Restaurant[];
}

export interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface FriendSearchResult {
  id: string;
  name: string;
  email: string;
  relationship: 'none' | 'friends' | 'incoming' | 'outgoing';
  requestId?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  address: string;
}

export const initialRestaurants: Restaurant[] = [];
