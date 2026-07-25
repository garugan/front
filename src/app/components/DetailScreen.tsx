import { ChevronLeft, MapPin, Pencil, Users } from 'lucide-react';
import { type Restaurant } from './data';
import { StarDisplay, StatusTag, FloorTag, ElevatorTag } from './shared';

interface DetailScreenProps {
  restaurantId: string;
  restaurants: Restaurant[];
  onBack: () => void;
  onEdit: (id: string) => void;
  onFriendRecords: () => void;
}

export function DetailScreen({ restaurantId, restaurants, onBack, onEdit, onFriendRecords }: DetailScreenProps) {
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>お店が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Photo header */}
      <div className="relative flex-shrink-0">
        <div className="h-56 bg-gray-200 overflow-hidden">
          <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-10 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Edit button */}
        <button
          onClick={() => onEdit(restaurant.id)}
          className="absolute top-10 right-16 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm"
        >
          <Pencil size={15} className="text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4 pb-8">
        {/* Name and status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-gray-900 leading-snug flex-1" style={{ fontWeight: 700 }}>{restaurant.name}</h2>
            <StatusTag status={restaurant.status} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{restaurant.category}</span>
          </div>

          {restaurant.status === 'visited' && (
            <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
              <StarDisplay rating={restaurant.rating} size={20} />
              <span className="text-sm text-gray-500">{restaurant.visitDate}</span>
            </div>
          )}
        </div>

        {/* Accessibility info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-xs text-gray-400 mb-2.5" style={{ fontWeight: 600 }}>アクセシビリティ</p>
          <div className="flex flex-wrap gap-2">
            <FloorTag floor={restaurant.floor} />
            <ElevatorTag elevator={restaurant.elevator} />
          </div>
        </div>

        {/* Memo */}
        {restaurant.memo && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>メモ</p>
            <p className="text-sm text-gray-700 leading-relaxed">{restaurant.memo}</p>
          </div>
        )}

        {/* Address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>住所</p>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{restaurant.address}</p>
          </div>
        </div>

        {/* Friend records button */}
        <button
          onClick={onFriendRecords}
          className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Users size={18} className="text-orange-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>フレンド一覧を見る</p>
            <p className="text-xs text-gray-400">フレンドが記録したお店を確認</p>
          </div>
          <ChevronLeft size={16} className="text-gray-300 rotate-180" />
        </button>
      </div>
    </div>
  );
}
