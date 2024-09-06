import { List } from "@telegram-apps/telegram-ui";
import GameListItem from "./GameListItem";

export default function GameList() {
  return (
    <List
      style={{
        padding: 0,
      }}
    >
      <GameListItem img="" name="Game Name" />
      <GameListItem img="" name="Game Name" />
    </List>
  );
}
