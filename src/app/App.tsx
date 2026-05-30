import { useEffect, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DetailScreen } from "./components/DetailScreen";
import { FriendsScreen } from "./components/FriendsScreen";
import { FriendRecordsScreen } from "./components/FriendRecordsScreen";
import { LoginScreen } from "./components/LoginScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { SideNav, TabBar, type Tab } from "./components/TabBar";
import {
  type Restaurant,
  type SearchResult,
  initialRestaurants,
  initialFriends,
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
  const [homeFilter, setHomeFilter] = useState<'visited' | 'want'>('visited');
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | undefined>();
  const [selectedFriendId, setSelectedFriendId] = useState<
    string | undefined
  >();
  const [selectedSearchResult, setSelectedSearchResult] = useState<
    SearchResult | undefined
  >();

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
        setIsLoggedIn(false);
      });

    void fetchRegisteredRestaurants()
      .then((registeredRestaurants) => {
        setRestaurants(registeredRestaurants);
      })
      .catch(() => {
        setRestaurants(initialRestaurants);
      });
  }, [isLoggedIn]);

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
      navigate("register");
      setSelectedRestaurantId(undefined);
      setSelectedSearchResult(undefined);
    } else if (tab === "friends") navigate("friends");
    else if (tab === "mypage") navigate("mypage");
  };

  return (
    <div className="size-full flex flex-col md:flex-row overflow-hidden bg-gray-50">
      <SideNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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
              setSelectedSearchResult(undefined);
              navigate("register", { restaurantId: id });
              setActiveTab("register");
            }}
            onFriendRecords={(friendId) => {
              navigate("friend-records", { friendId });
              setActiveTab("friends");
            }}
          />
        )}

        {currentView === "register" && (
          <RegisterScreen
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
            friends={initialFriends}
            onFriendClick={(id) =>
              navigate("friend-records", { friendId: id })
            }
          />
        )}

        {currentView === "friend-records" &&
          selectedFriendId && (
            <FriendRecordsScreen
              friendId={selectedFriendId}
              friends={initialFriends}
              onBack={() => navigate("friends")}
            />
          )}

        {currentView === "mypage" && (
          <MyPageScreen
            restaurants={restaurants}
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>

      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
