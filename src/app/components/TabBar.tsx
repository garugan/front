import { Home, Plus, Users, User, type LucideIcon } from 'lucide-react';

export type Tab = 'home' | 'register' | 'friends' | 'mypage';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'register', label: '登録', icon: Plus },
  { id: 'friends', label: 'フレンド', icon: Users },
  { id: 'mypage', label: 'マイページ', icon: User },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      className="bg-white border-t border-gray-100 flex-shrink-0 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isRegister = tab.id === 'register';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center h-full gap-0.5"
            >
              <span
                className={
                  isRegister
                    ? `w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500'
                      }`
                    : ''
                }
              >
                <Icon
                  size={isRegister ? 18 : 22}
                  className={
                    isRegister ? '' : isActive ? 'text-orange-500' : 'text-gray-400'
                  }
                  strokeWidth={isActive || isRegister ? 2.5 : 1.5}
                />
              </span>
              <span className={`text-[10px] ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SideNav({ activeTab, onTabChange }: TabBarProps) {
  return (
    <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-xl text-gray-900">
          <span className="text-orange-500" style={{ fontWeight: 700 }}>Band</span>
          <span style={{ fontWeight: 700 }}> Meshi</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Restaurant log</p>
      </div>

      <nav className="flex-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isRegister = tab.id === 'register';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full h-11 rounded-xl mb-1.5 px-3 flex items-center gap-3 text-sm transition-all ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
              style={{ fontWeight: isActive ? 700 : 500 }}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isRegister
                    ? 'bg-orange-500 text-white'
                    : isActive
                    ? 'bg-white text-orange-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon size={18} strokeWidth={isActive || isRegister ? 2.5 : 1.8} />
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
