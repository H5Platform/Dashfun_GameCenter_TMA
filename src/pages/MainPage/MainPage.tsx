import { Tabbar } from "@telegram-apps/telegram-ui";
import { FC, useState } from "react";
import GameCenter from "../GameCenter/GameCenter";
import FriendsPage from "../Friends/FriendsPage";

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

  return (
    <>
      <div className="p-3 pb-[200px]">
        {currentTab === "game" ? (
          <GameCenter />
        ) : currentTab === "friends" ? (
          <FriendsPage />
        ) : null}
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
