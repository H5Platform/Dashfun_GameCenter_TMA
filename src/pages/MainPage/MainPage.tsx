import { Tabbar } from "@telegram-apps/telegram-ui";
import { FC, useState } from "react";
import GameCenter from "../GameCenter/GameCenter";
import FriendsPage from "../Friends/FriendsPage";
import SpinWheel from "@/components/SpinWheel/SpinWheel";
import { useDashFunUser } from "@/components/DashFun/DashFunUser";
import { GameData } from "@/components/DashFunData/GameData";

const tabs = [
  {
    id: "game",
    text: "Game",
    Icon: () => <i className="fa-solid fa-gamepad text-2xl" />,
  },
  {
    id: "tasks",
    text: "Tasks",
    Icon: () => <i className="fa-solid fa-gift text-2xl" />,
  },
  {
    id: "friends",
    text: "Friends",
    Icon: () => <i className="fa-solid fa-user-group text-2xl" />,
  },
];

const MainPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const user = useDashFunUser()
  const game = new GameData({
    id: "LocalTest",
    iconUrl: "https://res.dashfun.games/icons/3kweb3-512.jpg",
    name: "Local Test",
    desc: "Local Test",
    url: "",
    genre: [],
    time: 0,
    openTime: 0,
    logoUrl: "",
    mainPicUrl: "",
  });

  return (
    <>
      <div className="p-3 pb-[200px]">
        {currentTab === "game" ? (
          <GameCenter />
        ) : currentTab === "friends" ? (
          <FriendsPage />
        ) : (
          <SpinWheel game={game} user={user} />
        )}
      </div>
      <Tabbar id="bottomNavigation">
        {tabs.map(({ id, text, Icon }) => (
          <Tabbar.Item
            key={id}
            text={text}
            selected={id === currentTab}
            onClick={() => setCurrentTab(id)}
          >
            <Icon />
          </Tabbar.Item>
        ))}
      </Tabbar>
    </>
  );
};

export default MainPage;
