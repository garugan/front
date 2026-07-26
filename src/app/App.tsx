import { useCallback, useEffect, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DetailScreen } from "./components/DetailScreen";
import { FriendsScreen } from "./components/FriendsScreen";
import { FriendRecordsScreen } from "./components/FriendRecordsScreen";
import { LoginScreen } from "./components/LoginScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { AppMenu, type Tab } from "./components/AppMenu";
import {
  type Friend,
  type FriendRequest,
  type Restaurant,
  type SearchResult,
  initialRestaurants,
} from "./components/data";
import {
  type AuthUser,
  clearAuthSession,
  fetchCurrentUser,
  getStoredAuthSession,
  login,
  register,
} from "./services/auth";
import {
  fetchRegisteredRestaurants,
  saveRegisteredRestaurant,
} from "./services/restaurants";
import {
  fetchFriendRequests,
  fetchFriends,
} from "./services/friends";

type View =
  | "home"
  | "detail"
  | "register"
  | "friends"
  | "friend-records"
  | "mypage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(getStoredAuthSession());
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getStoredAuthSession()?.user ?? null;
  });
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [currentView, setCurrentView] = useState<View>("home");
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [homeFilter, setHomeFilter] = useState<'visited' | 'want'>('visited');
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | undefined>();
  const [selectedFriendId, setSelectedFriendId] = useState<
    string | undefined
  >();
  const [selectedSearchResult, setSelectedSearchResult] = useState<
    SearchResult | undefined
  >();
  const [registerSession, setRegisterSession] = useState(0);

  const refreshFriends = useCallback(async () => {
    setFriendsLoading(true);

    try {
      const [nextFriends, nextRequests] = await Promise.all([
        fetchFriends(),
        fetchFriendRequests(),
      ]);
      setFriends(nextFriends);
      setFriendRequests(nextRequests);
    } finally {
      setFriendsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    void fetchCurrentUser()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        clearAuthSession();
        setCurrentUser(null);
        setRestaurants(initialRestaurants);
        setFriends([]);
        setFriendRequests([]);
        setIsLoggedIn(false);
      });

    void fetchRegisteredRestaurants()
      .then((registeredRestaurants) => {
        setRestaurants(registeredRestaurants);
      })
      .catch(() => {
        setRestaurants(initialRestaurants);
      });

    void refreshFriends().catch(() => {
      setFriends([]);
      setFriendRequests([]);
    });
  }, [isLoggedIn, refreshFriends]);

  const handleLogin = async (email: string, password: string, recaptchaToken: string) => {
    const session = await login(email, password, recaptchaToken);
    setCurrentUser(session.user);
    setIsLoggedIn(true);
  };

  const handleRegister = async (
    email: string,
    password: string,
    recaptchaToken: string,
    name?: string,
  ) => {
    const session = await register(email, password, recaptchaToken, name);
    setCurrentUser(session.user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRestaurants(initialRestaurants);
    setFriends([]);
    setFriendRequests([]);
    setActiveTab("home");
    setCurrentView("home");
    setSelectedRestaurantId(undefined);
    setSelectedFriendId(undefined);
    setSelectedSearchResult(undefined);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const navigate = (
    view: View,
    params?: {
      restaurantId?: string;
      friendId?: string;
      searchResult?: SearchResult;
    },
  ) => {
    setCurrentView(view);
    if (params?.restaurantId !== undefined)
      setSelectedRestaurantId(params.restaurantId);
    if (params?.friendId !== undefined)
      setSelectedFriendId(params.friendId);
    if (params?.searchResult !== undefined)
      setSelectedSearchResult(params.searchResult);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "home") navigate("home");
    else if (tab === "register") {
      setRegisterSession((current) => current + 1);
      navigate("register");
      setSelectedRestaurantId(undefined);
      setSelectedSearchResult(undefined);
    } else if (tab === "friends") {
      navigate("friends");
      void refreshFriends().catch(() => undefined);
    }
    else if (tab === "mypage") navigate("mypage");
  };

  return (
    <div className="size-full flex flex-col overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-hidden relative">
        {currentView === "home" && (
          <HomeScreen
            restaurants={restaurants}
            filter={homeFilter}
            onFilterChange={setHomeFilter}
            onRestaurantClick={(id) => {
              navigate("detail", { restaurantId: id });
            }}
          />
        )}

        {currentView === "detail" && selectedRestaurantId && (
          <DetailScreen
            restaurantId={selectedRestaurantId}
            restaurants={restaurants}
            onBack={() => navigate("home")}
            onEdit={(id) => {
              setRegisterSession((current) => current + 1);
              setSelectedSearchResult(undefined);
              navigate("register", { restaurantId: id });
              setActiveTab("register");
            }}
            onFriendRecords={() => {
              navigate("friends");
              setActiveTab("friends");
              void refreshFriends().catch(() => undefined);
            }}
          />
        )}

        {currentView === "register" && (
          <RegisterScreen
            key={`${selectedRestaurantId ?? "new"}:${registerSession}`}
            restaurantId={selectedRestaurantId}
            restaurants={restaurants}
            initialRestaurant={selectedSearchResult}
            onSave={async (restaurant) => {
              const savedRestaurant = await saveRegisteredRestaurant(restaurant);
              setRestaurants((current) => {
                const index = current.findIndex((item) => item.id === savedRestaurant.id);

                if (index === -1) {
                  return [savedRestaurant, ...current];
                }

                return current.map((item) => (
                  item.id === savedRestaurant.id ? savedRestaurant : item
                ));
              });
              setHomeFilter(savedRestaurant.status);
            }}
            onSaved={() => {
              navigate("home");
              setActiveTab("home");
            }}
          />
        )}

        {currentView === "friends" && (
          <FriendsScreen
            friends={friends}
            requests={friendRequests}
            isLoading={friendsLoading}
            onChanged={refreshFriends}
            onFriendClick={(id) =>
              navigate("friend-records", { friendId: id })
            }
          />
        )}

        {currentView === "friend-records" &&
          selectedFriendId && (
            <FriendRecordsScreen
              friendId={selectedFriendId}
              onBack={() => navigate("friends")}
              onRemoved={refreshFriends}
            />
          )}

        {currentView === "mypage" && (
          <MyPageScreen
            restaurants={restaurants}
            friendCount={friends.length}
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>

      <AppMenu
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
    </div>
  );
}
