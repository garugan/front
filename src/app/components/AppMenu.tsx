import {
  Home,
  LogOut,
  Menu,
  Plus,
  Users,
  User,
  type LucideIcon,
} from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export type Tab = 'home' | 'register' | 'friends' | 'mypage';

interface AppMenuProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'register', label: '登録', icon: Plus },
  { id: 'friends', label: 'フレンド', icon: Users },
  { id: 'mypage', label: 'マイページ', icon: User },
];

export function AppMenu({ activeTab, onTabChange, onLogout }: AppMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed right-4 top-10 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-orange-50 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          aria-label="メニューを開く"
        >
          <Menu size={19} strokeWidth={2.25} />
        </button>
      </SheetTrigger>

      <SheetContent className="w-[min(84vw,20rem)] gap-0 border-l border-gray-100 bg-white p-0">
        <SheetHeader className="border-b border-gray-100 px-5 pb-5 pt-8 text-left">
          <SheetTitle className="text-xl text-gray-900">
            <span className="text-orange-500">Band</span> Meshi
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-400">
            Restaurant log
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1.5 p-3" aria-label="メインメニュー">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isRegister = tab.id === 'register';

            return (
              <SheetClose asChild key={tab.id}>
                <button
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                  style={{ fontWeight: isActive ? 700 : 500 }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isRegister
                        ? 'bg-orange-500 text-white'
                        : isActive
                          ? 'bg-white text-orange-500'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive || isRegister ? 2.5 : 1.8}
                    />
                  </span>
                  <span>{tab.label}</span>
                </button>
              </SheetClose>
            );
          })}
        </nav>

        <SheetFooter className="border-t border-gray-100 p-3">
          <SheetClose asChild>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400">
                <LogOut size={18} strokeWidth={1.8} />
              </span>
              <span>ログアウト</span>
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
