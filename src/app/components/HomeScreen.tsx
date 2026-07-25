import { useState } from 'react';
import {
  ArrowUpDown,
  Building2,
  Check,
  CircleHelp,
  MapPin,
  Search,
  Star,
  X,
} from 'lucide-react';
import { type Restaurant } from './data';

type Filter = 'visited' | 'want';
type ElevatorFilter = 'all' | 'yes' | 'no' | 'unknown';
type FloorFilter = 'all' | '1F' | '2F+';

interface HomeScreenProps {
  restaurants: Restaurant[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onRestaurantClick: (id: string) => void;
}

export function HomeScreen({
  restaurants,
  filter,
  onFilterChange,
  onRestaurantClick,
}: HomeScreenProps) {
  const [query, setQuery] = useState('');
  const [elevatorFilter, setElevatorFilter] = useState<ElevatorFilter>('all');
  const [floorFilter, setFloorFilter] = useState<FloorFilter>('all');

  const filtered = restaurants.filter((r) => {
    const matchFilter = r.status === filter;
    const matchQuery = r.name.includes(query) || r.category.includes(query);
    const matchElevator = elevatorFilter === 'all' || r.elevator === elevatorFilter;
    const matchFloor = floorFilter === 'all' || r.floor === floorFilter;
    return matchFilter && matchQuery && matchElevator && matchFloor;
  });

  const visitedCount = restaurants.filter((r) => r.status === 'visited').length;
  const wantCount = restaurants.filter((r) => r.status === 'want').length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Status bar */}
      <div className="bg-white pt-10 px-4 pb-0 shadow-sm">
        {/* App header */}
        <div className="flex min-h-9 items-center mb-2 pr-12">
          <div>
            <h1 className="text-xl text-gray-900">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>Band</span>
              <span style={{ fontWeight: 700 }}> Meshi</span>
            </h1>
          </div>
        </div>

        <div className="mb-2 md:flex md:items-center md:gap-2">
          {/* Search bar */}
          <div className="mb-2 flex h-11 items-center gap-2 rounded-xl bg-gray-100 px-3 md:mb-0 md:flex-1">
            <Search size={15} className="flex-shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="お店を検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400 md:text-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-2 md:w-[32rem]">
            <div className="col-span-2 flex h-11 rounded-xl bg-gray-100">
              {([
                ['visited', '行った', visitedCount],
                ['want', '行きたい', wantCount],
              ] as [Filter, string, number][]).map(([id, label, count]) => (
                <button
                  key={id}
                  onClick={() => onFilterChange(id)}
                  className={`h-11 flex-1 rounded-xl text-xs transition-all ${
                    filter === id ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
                  }`}
                  style={{ fontWeight: filter === id ? 600 : 400 }}
                >
                  {label}
                  <span className="ml-1 text-[10px] opacity-70">{count}</span>
                </button>
              ))}
            </div>

            <label className="flex h-11 min-w-0 flex-col justify-center rounded-xl bg-gray-100 px-2">
              <span className="text-[9px] leading-none text-gray-400">階数</span>
              <select
                value={floorFilter}
                onChange={(event) => setFloorFilter(event.target.value as FloorFilter)}
                className="w-full bg-transparent text-xs leading-tight text-gray-700 outline-none"
              >
                <option value="all">すべて</option>
                <option value="1F">1階</option>
                <option value="2F+">2階以上</option>
              </select>
            </label>

            <label className="flex h-11 min-w-0 flex-col justify-center rounded-xl bg-gray-100 px-2">
              <span className="text-[9px] leading-none text-gray-400">EV</span>
              <select
                value={elevatorFilter}
                onChange={(event) => setElevatorFilter(event.target.value as ElevatorFilter)}
                className="w-full bg-transparent text-xs leading-tight text-gray-700 outline-none"
              >
                <option value="all">すべて</option>
                <option value="yes">あり</option>
                <option value="no">なし</option>
                <option value="unknown">不明</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Restaurant list */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        <div className="px-4 mb-1.5">
          <span className="text-xs text-gray-400">{filtered.length}件のお店</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={40} className="mb-3 opacity-30" />
            <p className="text-sm">お店が見つかりません</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 px-4">
            {filtered.map((r) => (
              <RestaurantSquareCard
                key={r.id}
                restaurant={r}
                onClick={() => onRestaurantClick(r.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RestaurantSquareCard({
  restaurant,
  onClick,
}: {
  restaurant: Restaurant;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-white text-left shadow-sm active:opacity-80"
    >
      {restaurant.photo ? (
        <img
          src={restaurant.photo}
          alt={restaurant.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-sky-50">
          <MapPin size={34} className="text-orange-300" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] text-orange-500 shadow-sm">
        <Star size={12} className="fill-orange-400 text-orange-400" />
        <span style={{ fontWeight: 700 }}>
          {restaurant.status === 'visited' && restaurant.rating > 0 ? restaurant.rating : '-'}
        </span>
      </div>

      <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
        <span
          className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] text-gray-600 shadow-sm"
          aria-label={`階数: ${restaurant.floor === '1F' ? '1階' : '2階以上'}`}
        >
          <Building2 size={11} aria-hidden="true" />
          <span style={{ fontWeight: 700 }}>{restaurant.floor}</span>
        </span>
        <ElevatorThumbnailBadge elevator={restaurant.elevator} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-2 text-sm leading-snug text-white drop-shadow-sm" style={{ fontWeight: 700 }}>
          {restaurant.name}
        </p>
      </div>
    </button>
  );
}

function ElevatorThumbnailBadge({
  elevator,
}: {
  elevator: Restaurant['elevator'];
}) {
  const config = {
    yes: {
      label: 'EV有り',
      shortLabel: '有',
      className: 'text-emerald-600',
      StatusIcon: Check,
    },
    no: {
      label: 'EV無し',
      shortLabel: '無',
      className: 'text-red-500',
      StatusIcon: X,
    },
    unknown: {
      label: 'EV不明',
      shortLabel: '不明',
      className: 'text-gray-500',
      StatusIcon: CircleHelp,
    },
  }[elevator];

  return (
    <span
      className={`flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-1 text-[10px] shadow-sm ${config.className}`}
      aria-label={config.label}
    >
      <ArrowUpDown size={10} aria-hidden="true" />
      <span style={{ fontWeight: 700 }}>EV</span>
      <config.StatusIcon size={10} strokeWidth={3} aria-hidden="true" />
      <span className="sr-only">{config.shortLabel}</span>
    </span>
  );
}
