import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DetailScreen } from "./components/DetailScreen";
import { FriendsScreen } from "./components/FriendsScreen";
import { FriendRecordsScreen } from "./components/FriendRecordsScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { SideNav, TabBar, type Tab } from "./components/TabBar";
import {
  type SearchResult,
  initialRestaurants,
  initialFriends,
} from "./components/data";

type View =
  | "home"
  | "detail"
  | "register"
  | "friends"
  | "friend-records"
  | "mypage";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string | undefined>();
  const [selectedFriendId, setSelectedFriendId] = useState<
    string | undefined
  >();
  const [selectedSearchResult, setSelectedSearchResult] = useState<
    SearchResult | undefined
  >();

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
            restaurants={initialRestaurants}
            onRestaurantClick={(id) => {
              navigate("detail", { restaurantId: id });
            }}
          />
        )}

        {currentView === "detail" && selectedRestaurantId && (
          <DetailScreen
            restaurantId={selectedRestaurantId}
            restaurants={initialRestaurants}
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
            initialRestaurant={selectedSearchResult}
            onSave={() => {
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

        {currentView === "mypage" && <MyPageScreen />}
      </div>

      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
