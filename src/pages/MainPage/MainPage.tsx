import { Tabbar } from "@telegram-apps/telegram-ui";
import { FC, useState } from "react";
import GameCenter from "../GameCenter/GameCenter";

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
    <div className="overflow-hidden p-3">
      <div className="mb-[100px]">
        {currentTab === "game" ? <GameCenter /> : null}
      </div>

      <Tabbar
        style={{
          height: "90px",
          position: "fixed",
        }}
      >
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
    </div>
  );
};

export default MainPage;
