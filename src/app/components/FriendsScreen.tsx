import { FormEvent, useState } from 'react';
import {
  Check,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Mail,
  Search,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  type Friend,
  type FriendRequest,
  type FriendSearchResult,
} from './data';
import {
  respondToFriendRequest,
  searchFriendByEmail,
  sendFriendRequest,
} from '../services/friends';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  ElevatorTag,
  FloorTag,
  StarDisplay,
  StatusTag,
  UserAvatar,
} from './shared';

interface FriendsScreenProps {
  friends: Friend[];
  requests: FriendRequest[];
  isLoading: boolean;
  onFriendClick: (id: string) => void;
  onChanged: () => Promise<void>;
}

export function FriendsScreen({
  friends,
  requests,
  isLoading,
  onFriendClick,
  onChanged,
}: FriendsScreenProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] =
    useState<FriendSearchResult | null>();
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [pendingAction, setPendingAction] = useState('');

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('メールアドレスを入力してください');
      return;
    }

    setError('');
    setIsSearching(true);

    try {
      setSearchResult(await searchFriendByEmail(normalizedEmail));
    } catch (searchError) {
      setSearchResult(undefined);
      setError(toErrorMessage(searchError));
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (user: FriendSearchResult) => {
    setPendingAction(`send-${user.id}`);
    setError('');

    try {
      const request = await sendFriendRequest(user.id);
      setSearchResult({
        ...user,
        relationship:
          request.status === 'ACCEPTED' ? 'friends' : 'outgoing',
      });
      await onChanged();
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setPendingAction('');
    }
  };

  const handleResponse = async (
    requestId: string,
    action: 'accept' | 'reject',
  ) => {
    setPendingAction(`${action}-${requestId}`);
    setError('');

    try {
      await respondToFriendRequest(requestId, action);
      if (searchResult?.requestId === requestId) {
        setSearchResult(
          action === 'accept'
            ? { ...searchResult, relationship: 'friends' }
            : { ...searchResult, relationship: 'none', requestId: undefined },
        );
      }
      await onChanged();
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setPendingAction('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white pt-10 px-4 pb-4 shadow-sm">
        <div className="flex items-center justify-between pr-12">
          <h2 className="text-gray-800" style={{ fontWeight: 700 }}>
            フレンド
          </h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1.5 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full active:bg-orange-600"
            style={{ fontWeight: 600 }}
          >
            <UserPlus size={13} />
            追加
            {requests.length > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-white text-orange-500 text-[10px] flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-3 pb-4">
        {requests.length > 0 && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-[calc(100%-2rem)] mx-4 mb-3 p-3 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <UserPlus size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-orange-700 font-semibold">
                {requests.length}件のフレンド申請があります
              </p>
              <p className="text-[11px] text-orange-500 mt-0.5">
                タップして確認
              </p>
            </div>
            <ChevronRight size={16} className="text-orange-300" />
          </button>
        )}

        <div className="px-4 mb-2">
          <span className="text-xs text-gray-400">
            {friends.length}人のフレンド
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-orange-400">
            <LoaderCircle size={28} className="animate-spin" />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">フレンドはまだ追加されていません</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 text-xs text-orange-500 font-semibold"
            >
              メールアドレスから追加する
            </button>
          </div>
        ) : (
          friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onFriendClick(friend.id)}
              className="w-full bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden text-left active:opacity-80"
              style={{ width: 'calc(100% - 2rem)' }}
            >
              <div className="p-4 pb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar name={friend.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 700 }}>
                      {friend.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {friend.restaurantCount}件のお店を記録中
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 flex-shrink-0"
                  />
                </div>
              </div>

              {friend.recentRestaurant ? (
                <div className="border-t border-gray-50 mx-4 pt-3 pb-4">
                  <p
                    className="text-[10px] text-gray-400 mb-2"
                    style={{ fontWeight: 600 }}
                  >
                    最近記録したお店
                  </p>
                  <div className="flex gap-3 items-center">
                    {friend.recentRestaurant.photo ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={friend.recentRestaurant.photo}
                          alt={friend.recentRestaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🍽️</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs text-gray-700 leading-snug mb-1 truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {friend.recentRestaurant.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-1">
                        <StatusTag status={friend.recentRestaurant.status} />
                        <FloorTag floor={friend.recentRestaurant.floor} />
                        <ElevatorTag
                          elevator={friend.recentRestaurant.elevator}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {friend.recentRestaurant.status === 'visited' && (
                          <StarDisplay
                            rating={friend.recentRestaurant.rating}
                            size={10}
                          />
                        )}
                        <span className="text-[10px] text-gray-400">
                          {friend.recentRestaurant.visitDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-50 mx-4 py-3 text-[11px] text-gray-400">
                  まだお店を記録していません
                </div>
              )}
            </button>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl p-5">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              フレンドを追加
            </DialogTitle>
            <DialogDescription>
              登録時のメールアドレスで友達を探せます
            </DialogDescription>
          </DialogHeader>

          {requests.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                届いた申請
              </p>
              <div className="space-y-2">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl bg-orange-50 p-3 flex items-center gap-3"
                  >
                    <UserAvatar name={request.user.name} className="w-10 h-10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {request.user.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {request.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => handleResponse(request.id, 'reject')}
                      disabled={Boolean(pendingAction)}
                      className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center disabled:opacity-50"
                      aria-label="拒否"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => handleResponse(request.id, 'accept')}
                      disabled={Boolean(pendingAction)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center disabled:opacity-50"
                      aria-label="承認"
                    >
                      {pendingAction === `accept-${request.id}` ? (
                        <LoaderCircle size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <form onSubmit={handleSearch}>
            <label
              htmlFor="friend-email"
              className="text-xs font-semibold text-gray-600"
            >
              メールアドレス
            </label>
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <input
                  id="friend-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSearchResult(undefined);
                    setError('');
                  }}
                  placeholder="friend@example.com"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="h-10 px-4 rounded-xl bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSearching ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
                検索
              </button>
            </div>
          </form>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-xs text-red-500">
              {error}
            </p>
          )}

          {searchResult === null && (
            <p className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-500">
              該当するユーザーが見つかりませんでした
            </p>
          )}

          {searchResult && (
            <div className="rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
              <UserAvatar name={searchResult.name} className="w-11 h-11" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {searchResult.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {searchResult.email}
                </p>
              </div>
              <SearchResultAction
                result={searchResult}
                isPending={Boolean(pendingAction)}
                onSend={() => handleSendRequest(searchResult)}
                onAccept={() =>
                  searchResult.requestId &&
                  handleResponse(searchResult.requestId, 'accept')
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SearchResultAction({
  result,
  isPending,
  onSend,
  onAccept,
}: {
  result: FriendSearchResult;
  isPending: boolean;
  onSend: () => void;
  onAccept: () => void;
}) {
  if (result.relationship === 'friends') {
    return (
      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
        <Check size={13} />
        フレンド
      </span>
    );
  }

  if (result.relationship === 'outgoing') {
    return (
      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
        <Clock3 size={13} />
        申請済み
      </span>
    );
  }

  if (result.relationship === 'incoming') {
    return (
      <button
        onClick={onAccept}
        disabled={isPending}
        className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold disabled:opacity-50"
      >
        承認
      </button>
    );
  }

  return (
    <button
      onClick={onSend}
      disabled={isPending}
      className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold disabled:opacity-50"
    >
      申請する
    </button>
  );
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '操作に失敗しました';
}
