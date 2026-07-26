import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Pencil,
  Users,
} from 'lucide-react';
import { fetchRestaurantPhoto } from '../services/restaurants';
import { type PlacePhoto, type Restaurant } from './data';
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
  const [photo, setPhoto] = useState<PlacePhoto | null>();

  useEffect(() => {
    if (!restaurant) {
      setPhoto(null);
      return;
    }

    const controller = new AbortController();
    setPhoto(undefined);

    void fetchRestaurantPhoto(restaurant.id, controller.signal)
      .then(setPhoto)
      .catch((error) => {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          setPhoto(null);
        }
      });

    return () => {
      controller.abort();
    };
  }, [restaurant]);

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
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-sky-50">
          {photo === undefined ? (
            <div className="flex h-full items-center justify-center text-orange-300">
              <LoaderCircle size={28} className="animate-spin" />
            </div>
          ) : photo ? (
            <img
              src={photo.url}
              alt={restaurant.name}
              className="h-full w-full object-cover"
              onError={() => setPhoto(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MapPin size={42} className="text-orange-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {photo && (
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-2 text-[10px] text-white">
              <div className="flex flex-wrap gap-2">
                {photo.authorAttributions.map((author, index) => {
                  const content = (
                    <>
                      {author.photoUri && (
                        <img
                          src={author.photoUri}
                          alt=""
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      )}
                      <span>{author.displayName}</span>
                    </>
                  );

                  return author.uri ? (
                    <a
                      key={`${author.displayName}-${index}`}
                      href={author.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 backdrop-blur-sm"
                    >
                      {content}
                    </a>
                  ) : (
                    <span
                      key={`${author.displayName}-${index}`}
                      className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 backdrop-blur-sm"
                    >
                      {content}
                    </span>
                  );
                })}
              </div>
              <a
                href={photo.googleMapsUri}
                target="_blank"
                rel="noreferrer"
                translate="no"
                aria-label="Google Mapsで元の写真を見る"
                className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white/95 px-2 py-1 text-xs font-normal text-gray-700 shadow-sm"
              >
                Google Maps
                <ExternalLink size={12} />
              </a>
            </div>
          )}
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
