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

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  restaurantCount: number;
  recentRestaurant: {
    name: string;
    photo: string;
    rating: number;
    visitDate: string;
    floor: '1F' | '2F+';
    elevator: 'yes' | 'no' | 'unknown';
    status: 'visited' | 'want';
  };
  restaurants: Restaurant[];
}

export type SearchResult = Pick<
  Restaurant,
  'id' | 'name' | 'photo' | 'category' | 'address'
>;

export const initialRestaurants: Restaurant[] = [];

export const restaurantSearchResults: SearchResult[] = [];

export const initialFriends: Friend[] = [];
