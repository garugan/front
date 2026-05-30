import { ChevronLeft, UtensilsCrossed } from 'lucide-react';
import { type Friend } from './data';
import { RestaurantCardRow } from './shared';

interface FriendRecordsScreenProps {
  friendId: string;
  friends: Friend[];
  onBack: () => void;
}

export function FriendRecordsScreen({ friendId, friends, onBack }: FriendRecordsScreenProps) {
  const friend = friends.find((f) => f.id === friendId);

  if (!friend) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>フレンドが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-10 px-4 pb-0 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-100">
              <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-gray-800" style={{ fontWeight: 700 }}>{friend.name}</p>
              <p className="text-[11px] text-gray-400">の記録</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 border-t border-gray-100 py-3">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed size={13} className="text-orange-400" />
            <span className="text-xs text-gray-500">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>{friend.restaurantCount}</span>
              <span className="ml-0.5">件登録</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            <span className="text-xs text-gray-500">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>{friend.restaurants.filter((r) => r.status === 'visited').length}</span>
              <span className="ml-0.5">件行った</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span className="text-xs text-gray-500">
              <span className="text-sky-500" style={{ fontWeight: 700 }}>{friend.restaurants.filter((r) => r.status === 'want').length}</span>
              <span className="ml-0.5">件行きたい</span>
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant list */}
      <div className="flex-1 overflow-y-auto pt-3 pb-4">
        {friend.restaurants.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <UtensilsCrossed size={40} className="mb-3 opacity-30" />
            <p className="text-sm">まだお店が記録されていません</p>
          </div>
        ) : (
          <>
            <div className="px-4 mb-2">
              <span className="text-xs text-gray-400">{friend.restaurants.length}件のお店</span>
            </div>
            {friend.restaurants.map((r) => (
              <div key={r.id} className="relative">
                {/* Friend badge */}
                <div className="absolute top-3 right-7 z-10">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden">
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] text-indigo-500">{friend.name.split(' ')[0]}</span>
                  </div>
                </div>
                <RestaurantCardRow restaurant={r} onClick={() => {}} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
