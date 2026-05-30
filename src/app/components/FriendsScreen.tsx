import { ChevronRight, UserPlus, Users } from 'lucide-react';
import { type Friend } from './data';
import { StarDisplay, StatusTag, FloorTag, ElevatorTag } from './shared';

interface FriendsScreenProps {
  friends: Friend[];
  onFriendClick: (id: string) => void;
}

export function FriendsScreen({ friends, onFriendClick }: FriendsScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-10 px-4 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800" style={{ fontWeight: 700 }}>フレンド</h2>
          <button className="flex items-center gap-1.5 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
            <UserPlus size={13} />
            追加
          </button>
        </div>
      </div>

      {/* Friends list */}
      <div className="flex-1 overflow-y-auto pt-3 pb-4">
        <div className="px-4 mb-2">
          <span className="text-xs text-gray-400">{friends.length}人のフレンド</span>
        </div>

        {friends.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">フレンドはまだ追加されていません</p>
          </div>
        ) : friends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => onFriendClick(friend.id)}
            className="w-full bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden text-left"
            style={{ width: 'calc(100% - 2rem)' }}
          >
            {/* Friend info */}
            <div className="p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-100">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800" style={{ fontWeight: 700 }}>{friend.name}</p>
                  <p className="text-xs text-gray-400">{friend.restaurantCount}件のお店を記録中</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </div>
            </div>

            {/* Recent restaurant */}
            <div className="border-t border-gray-50 mx-4 pt-3 pb-4">
              <p className="text-[10px] text-gray-400 mb-2" style={{ fontWeight: 600 }}>最近記録したお店</p>
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={friend.recentRestaurant.photo}
                    alt={friend.recentRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-snug mb-1" style={{ fontWeight: 600 }}>
                    {friend.recentRestaurant.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    <StatusTag status={friend.recentRestaurant.status} />
                    <FloorTag floor={friend.recentRestaurant.floor} />
                    <ElevatorTag elevator={friend.recentRestaurant.elevator} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StarDisplay rating={friend.recentRestaurant.rating} size={10} />
                    <span className="text-[10px] text-gray-400">{friend.recentRestaurant.visitDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
