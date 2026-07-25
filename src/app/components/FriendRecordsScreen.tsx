import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  LoaderCircle,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { type FriendDetails } from './data';
import { RestaurantCardRow, UserAvatar } from './shared';
import { fetchFriendDetails, removeFriend } from '../services/friends';

interface FriendRecordsScreenProps {
  friendId: string;
  onBack: () => void;
  onRemoved: () => Promise<void>;
}

export function FriendRecordsScreen({
  friendId,
  onBack,
  onRemoved,
}: FriendRecordsScreenProps) {
  const [friend, setFriend] = useState<FriendDetails | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError('');

    void fetchFriendDetails(friendId)
      .then((details) => {
        if (isActive) {
          setFriend(details);
        }
      })
      .catch((fetchError) => {
        if (isActive) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'フレンドの記録を取得できませんでした',
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [friendId]);

  const handleRemove = async () => {
    if (
      !friend ||
      !window.confirm(`${friend.name}さんをフレンドから解除しますか？`)
    ) {
      return;
    }

    setIsRemoving(true);
    setError('');

    try {
      await removeFriend(friend.id);
      await onRemoved();
      onBack();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : 'フレンドを解除できませんでした',
      );
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-orange-400">
        <LoaderCircle size={28} className="animate-spin" />
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
        <p>{error || 'フレンドが見つかりません'}</p>
        <button onClick={onBack} className="text-sm text-orange-500">
          フレンド一覧に戻る
        </button>
      </div>
    );
  }

  const visitedCount = friend.restaurants.filter(
    (restaurant) => restaurant.status === 'visited',
  ).length;
  const wantCount = friend.restaurants.length - visitedCount;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white pt-10 px-4 pb-0 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pr-12">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100"
            aria-label="戻る"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <UserAvatar name={friend.name} className="w-10 h-10" />
            <div className="min-w-0">
              <p
                className="text-gray-800 truncate"
                style={{ fontWeight: 700 }}
              >
                {friend.name}
              </p>
              <p className="text-[11px] text-gray-400">の記録</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
            aria-label="フレンド解除"
          >
            {isRemoving ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>

        <div className="flex gap-4 border-t border-gray-100 py-3">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed size={13} className="text-orange-400" />
            <span className="text-xs text-gray-500">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>
                {friend.restaurantCount}
              </span>
              <span className="ml-0.5">件登録</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            <span className="text-xs text-gray-500">
              <span className="text-orange-500" style={{ fontWeight: 700 }}>
                {visitedCount}
              </span>
              <span className="ml-0.5">件行った</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span className="text-xs text-gray-500">
              <span className="text-sky-500" style={{ fontWeight: 700 }}>
                {wantCount}
              </span>
              <span className="ml-0.5">件行きたい</span>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-red-50 text-xs text-red-500">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pt-3 pb-4">
        {friend.restaurants.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <UtensilsCrossed size={40} className="mb-3 opacity-30" />
            <p className="text-sm">まだお店が記録されていません</p>
          </div>
        ) : (
          <>
            <div className="px-4 mb-2">
              <span className="text-xs text-gray-400">
                {friend.restaurants.length}件のお店
              </span>
            </div>
            {friend.restaurants.map((restaurant) => (
              <div key={restaurant.id} className="relative">
                <div className="absolute top-3 right-7 z-10">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <UserAvatar
                      name={friend.name}
                      className="w-3.5 h-3.5 border-0"
                    />
                    <span className="text-[9px] text-indigo-500">
                      {friend.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <RestaurantCardRow restaurant={restaurant} onClick={() => {}} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
