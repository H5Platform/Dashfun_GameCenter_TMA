import { Button, Cell } from "@telegram-apps/telegram-ui";

export type GameLIstItemParam = {
  img: string,
  name: string
}

export default function GameListItem(_p: GameLIstItemParam) {
  return (
    <Cell
      before={
        <img
          src="https://picsum.photos/50"
          alt="game image"
          className="rounded-lg"
        />
      }
      after={
        <Button size="s" mode="bezeled" className="px-4">
          PLAY
        </Button>
      }
      subtitle="Game Description"
      className="no-padding-cell"
    >
      Game Name
    </Cell>
  );
}
