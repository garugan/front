import { Star } from 'lucide-react';
import { type Restaurant } from './data';

export function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export function StatusTag({ status }: { status: 'visited' | 'want' }) {
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
        status === 'visited' ? 'bg-orange-100 text-orange-600' : 'bg-sky-50 text-sky-500'
      }`}
    >
      {status === 'visited' ? '行った' : '行きたい'}
    </span>
  );
}

export function FloorTag({ floor }: { floor: '1F' | '2F+' }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      {floor === '1F' ? '1階' : '2階以上'}
    </span>
  );
}

export function ElevatorTag({ elevator }: { elevator: 'yes' | 'no' | 'unknown' }) {
  const labels = { yes: 'EV有り', no: 'EV無し', unknown: 'EV不明' };
  const colors = {
    yes: 'bg-emerald-50 text-emerald-600',
    no: 'bg-red-50 text-red-400',
    unknown: 'bg-gray-100 text-gray-400',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors[elevator]}`}>
      {labels[elevator]}
    </span>
  );
}

export function RestaurantCardRow({
  restaurant,
  onClick,
}: {
  restaurant: Restaurant;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden cursor-pointer active:opacity-80"
      onClick={onClick}
    >
      <div className="flex">
        <div className="w-24 h-24 flex-shrink-0">
          <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 mb-1">{restaurant.name}</p>
          <div className="flex flex-wrap gap-1 mb-1.5">
            <StatusTag status={restaurant.status} />
            <FloorTag floor={restaurant.floor} />
            <ElevatorTag elevator={restaurant.elevator} />
          </div>
          {restaurant.status === 'visited' && (
            <div className="flex items-center gap-1.5 mb-1">
              <StarDisplay rating={restaurant.rating} size={11} />
              {restaurant.visitDate && (
                <span className="text-[10px] text-gray-400">{restaurant.visitDate}</span>
              )}
            </div>
          )}
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{restaurant.memo}</p>
        </div>
      </div>
    </div>
  );
}
