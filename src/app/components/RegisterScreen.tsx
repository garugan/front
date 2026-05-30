import { useState } from 'react';
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Star,
  X,
} from 'lucide-react';
import { type SearchResult, initialRestaurants, restaurantSearchResults } from './data';

interface RegisterScreenProps {
  restaurantId?: string;
  initialRestaurant?: SearchResult;
  onSave: () => void;
}

type ElevatorOption = 'yes' | 'no' | 'unknown';
type FloorOption = '1F' | '2F+';

export function RegisterScreen({
  restaurantId,
  initialRestaurant,
  onSave,
}: RegisterScreenProps) {
  const existing = restaurantId ? initialRestaurants.find((r) => r.id === restaurantId) : null;
  const draft = existing ?? initialRestaurant;

  const [selectedRestaurant, setSelectedRestaurant] = useState<SearchResult | undefined>(draft);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [status, setStatus] = useState<'visited' | 'want'>(existing?.status ?? 'visited');
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visitDate, setVisitDate] = useState(existing?.visitDate ?? '2026-05-29');
  const [memo, setMemo] = useState(existing?.memo ?? '');
  const [floor, setFloor] = useState<FloorOption>(existing?.floor ?? '1F');
  const [elevator, setElevator] = useState<ElevatorOption>(existing?.elevator ?? 'unknown');
  const [saved, setSaved] = useState(false);
  const address = selectedRestaurant?.address ?? 'タップしてお店を検索してください';
  const category = selectedRestaurant?.category;

  const handleSave = () => {
    setSaved(true);
    setTimeout(onSave, 800);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white pt-10 px-4 pb-4 shadow-sm flex items-center gap-3">
        <h2 className="text-gray-800 flex-1" style={{ fontWeight: 700 }}>
          {existing ? 'お店を編集' : 'お店を記録する'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Restaurant name */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-[calc(100%-2rem)] bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm text-left active:opacity-80"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Search size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1" style={{ fontWeight: 600 }}>
                店名
              </p>
              <p
                className={selectedRestaurant ? 'text-gray-800' : 'text-gray-400'}
                style={{ fontWeight: 600 }}
              >
                {selectedRestaurant?.name ?? 'お店を検索'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{address}</p>
              {category && (
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mt-2">
                  {category}
                </span>
              )}
            </div>
            <ChevronRight size={16} className="text-gray-300 mt-3 flex-shrink-0" />
          </div>
        </button>

        {/* Status */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>ステータス</p>
          <div className="flex gap-2">
            {([['visited', '行った'], ['want', '行きたい']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatus(val)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                  status === val
                    ? val === 'visited'
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                      : 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
                style={{ fontWeight: status === val ? 600 : 400 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        {status === 'visited' && (
          <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>行った日</p>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none"
            />
          </div>
        )}

        {/* Star rating */}
        {status === 'visited' && (
          <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>評価</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    size={40}
                    className={
                      n <= (hoverRating || rating)
                        ? 'text-orange-400 fill-orange-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-xs text-orange-500 mt-2" style={{ fontWeight: 500 }}>
                {['', '残念…', 'まあまあ', '良かった', 'とても良い', '最高！'][rating]}
              </p>
            )}
          </div>
        )}

        {/* Memo */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>メモ</p>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="感想・おすすめポイント・次回試したいメニューなど..."
            rows={4}
            className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none resize-none placeholder:text-gray-400"
          />
        </div>

        {/* Accessibility info */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>アクセシビリティ情報</p>

          {/* Floor */}
          <div className="mb-3">
            <p className="text-[11px] text-gray-400 mb-2">階数</p>
            <div className="flex gap-2">
              {([['1F', '1階（地上）'], ['2F+', '2階以上']] as [FloorOption, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFloor(val)}
                  className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                    floor === val ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-gray-100 text-gray-500'
                  }`}
                  style={{ fontWeight: floor === val ? 600 : 400 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Elevator */}
          <div>
            <p className="text-[11px] text-gray-400 mb-2">エレベーター</p>
            <div className="flex gap-2">
              {([['yes', 'あり'], ['no', 'なし'], ['unknown', '不明']] as [ElevatorOption, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setElevator(val)}
                  className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                    elevator === val
                      ? val === 'yes'
                        ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                        : val === 'no'
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  style={{ fontWeight: elevator === val ? 600 : 400 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>写真</p>
          <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400">
            <Camera size={28} className="opacity-50" />
            <span className="text-xs">タップして写真を追加</span>
          </button>
        </div>

        {/* Save button */}
        <div className="mx-4 mt-4">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl text-white transition-all ${
              saved ? 'bg-emerald-500' : 'bg-orange-500 active:bg-orange-600'
            } shadow-lg`}
            style={{ fontWeight: 700 }}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check size={18} />
                保存しました！
              </span>
            ) : (
              '保存する'
            )}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <RestaurantSearchPanel
          onClose={() => setIsSearchOpen(false)}
          onSelect={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setIsSearchOpen(false);
          }}
        />
      )}
    </div>
  );
}

function RestaurantSearchPanel({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (restaurant: SearchResult) => void;
}) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const filtered = restaurantSearchResults.filter(
    (restaurant) =>
      restaurant.name.includes(query) ||
      restaurant.category.includes(query) ||
      restaurant.address.includes(query),
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSearched(value.trim().length > 0);
  };

  const clearQuery = () => {
    setQuery('');
    setSearched(false);
  };

  return (
    <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col">
      <div className="bg-white pt-10 px-4 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h3 className="text-gray-800 flex-1" style={{ fontWeight: 700 }}>
            お店を検索
          </h3>
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2.5 gap-2">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="店名・エリアで検索..."
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          {query && (
            <button type="button" onClick={clearQuery}>
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!searched ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-gray-400">
            <Search size={40} className="mb-3 opacity-30" />
            <p className="text-sm text-gray-500" style={{ fontWeight: 600 }}>
              店名やエリアを入力してください
            </p>
            <p className="text-xs mt-1 leading-relaxed">
              現在、検索候補データは未登録です。
            </p>
          </div>
        ) : (
          <div className="pt-3 pb-4">
            <div className="px-4 mb-2">
              <span className="text-xs text-gray-400">
                {filtered.length > 0 ? `${filtered.length}件の検索結果` : '検索結果がありません'}
              </span>
            </div>
            {filtered.map((restaurant) => (
              <RestaurantSearchResultRow
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={onSelect}
              />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <Search size={36} className="mb-2 opacity-30" />
                <p className="text-sm">「{query}」に一致するお店が見つかりませんでした</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RestaurantSearchResultRow({
  restaurant,
  compact = false,
  onSelect,
}: {
  restaurant: SearchResult;
  compact?: boolean;
  onSelect: (restaurant: SearchResult) => void;
}) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onSelect(restaurant)}
        className="w-full bg-white rounded-xl px-3 py-3 flex items-center gap-3 shadow-sm text-left"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-snug" style={{ fontWeight: 500 }}>
            {restaurant.name}
          </p>
          <p className="text-[11px] text-gray-400">{restaurant.category}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(restaurant)}
      className="w-[calc(100%-2rem)] bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden text-left"
    >
      <div className="flex items-stretch">
        <div className="w-20 h-20 flex-shrink-0">
          <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <p className="text-sm text-gray-800 leading-snug line-clamp-1 mb-1" style={{ fontWeight: 600 }}>
            {restaurant.name}
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 inline-block mb-1.5">
            {restaurant.category}
          </span>
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-gray-400 flex-shrink-0" />
            <p className="text-[10px] text-gray-400 line-clamp-1">{restaurant.address}</p>
          </div>
        </div>
        <div className="flex items-center pr-3">
          <div className="bg-orange-500 text-white text-[11px] px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
            選択
          </div>
        </div>
      </div>
    </button>
  );
}
