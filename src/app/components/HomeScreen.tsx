import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { type Restaurant } from './data';
import { RestaurantCardRow } from './shared';

type Filter = 'all' | 'visited' | 'want';

interface HomeScreenProps {
  restaurants: Restaurant[];
  onRestaurantClick: (id: string) => void;
}

export function HomeScreen({ restaurants, onRestaurantClick }: HomeScreenProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = restaurants.filter((r) => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchQuery = r.name.includes(query) || r.category.includes(query);
    return matchFilter && matchQuery;
  });

  const visitedCount = restaurants.filter((r) => r.status === 'visited').length;
  const wantCount = restaurants.filter((r) => r.status === 'want').length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Status bar */}
      <div className="bg-white pt-10 px-4 pb-0 shadow-sm">
        {/* App header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl text-gray-900">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>Mog</span>
              <span style={{ fontWeight: 700 }}>Reco</span>
              <span className="text-gray-400 text-sm ml-1" style={{ fontWeight: 400 }}>Alternative</span>
            </h1>
          </div>
          <button className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <SlidersHorizontal size={17} className="text-orange-500" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-orange-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-orange-400">行ったお店</p>
            <p className="text-orange-600" style={{ fontWeight: 700, fontSize: 18 }}>{visitedCount}<span className="text-xs ml-0.5" style={{ fontWeight: 400 }}>件</span></p>
          </div>
          <div className="flex-1 bg-sky-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-sky-400">行きたいお店</p>
            <p className="text-sky-600" style={{ fontWeight: 700, fontSize: 18 }}>{wantCount}<span className="text-xs ml-0.5" style={{ fontWeight: 400 }}>件</span></p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2.5 gap-2 mb-3">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="お店を検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
          {([['all', 'すべて'], ['visited', '行った'], ['want', '行きたい']] as [Filter, string][]).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
                  filter === id ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
                }`}
                style={{ fontWeight: filter === id ? 600 : 400 }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Restaurant list */}
      <div className="flex-1 overflow-y-auto pt-3 pb-4">
        <div className="px-4 mb-2">
          <span className="text-xs text-gray-400">{filtered.length}件のお店</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={40} className="mb-3 opacity-30" />
            <p className="text-sm">お店が見つかりません</p>
          </div>
        ) : (
          filtered.map((r) => (
            <RestaurantCardRow key={r.id} restaurant={r} onClick={() => onRestaurantClick(r.id)} />
          ))
        )}
      </div>
    </div>
  );
}
