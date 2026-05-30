import { Settings, ChevronRight, Bell, Shield, HelpCircle, LogOut, Star, UtensilsCrossed, Users, Heart, User } from 'lucide-react';
import { initialRestaurants, initialFriends } from './data';

export function MyPageScreen() {
  const visitedCount = initialRestaurants.filter((r) => r.status === 'visited').length;
  const wantCount = initialRestaurants.filter((r) => r.status === 'want').length;
  const friendCount = initialFriends.length;

  const menuItems = [
    { icon: Bell, label: '通知設定', sub: 'フレンドの新着記録をお知らせ' },
    { icon: Shield, label: 'プライバシー設定', sub: '記録の公開範囲' },
    { icon: HelpCircle, label: 'ヘルプ・よくある質問', sub: null },
    { icon: LogOut, label: 'ログアウト', sub: null, danger: true },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white pt-10 px-4 pb-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800" style={{ fontWeight: 700 }}>マイページ</h2>
          <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Settings size={17} className="text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            <User size={26} className="text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900" style={{ fontWeight: 700, fontSize: 17 }}>ユーザー未設定</p>
            <p className="text-xs text-gray-400 mt-0.5">プロフィール情報は未設定です</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {[
            { label: '記録', value: initialRestaurants.length, icon: UtensilsCrossed, color: 'text-gray-600', bg: 'bg-gray-50' },
            { label: '行った', value: visitedCount, icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: '行きたい', value: wantCount, icon: Star, color: 'text-sky-500', bg: 'bg-sky-50' },
            { label: 'フレンド', value: friendCount, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex flex-col items-center py-4 px-1">
              <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center mb-1`}>
                <Icon size={14} className={color} />
              </div>
              <p className="text-gray-800" style={{ fontWeight: 700, fontSize: 18 }}>{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings menu */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
                i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.danger ? 'bg-red-50' : 'bg-gray-100'}`}>
                <Icon size={16} className={item.danger ? 'text-red-400' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${item.danger ? 'text-red-400' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                  {item.label}
                </p>
                {item.sub && <p className="text-[11px] text-gray-400">{item.sub}</p>}
              </div>
              {!item.danger && <ChevronRight size={15} className="text-gray-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
