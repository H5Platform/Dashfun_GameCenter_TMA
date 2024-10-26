import { Button, Cell } from "@telegram-apps/telegram-ui";
export type GameListItemInfo = {
  img: string,
  name: string
}

export default function GameListItem({ img, name }: GameListItemInfo) {
  console.log(img, name)
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
      //   style={{ padding: 0, gap: 10 }}
      className="no-padding-cell"
    >
      Game Name
    </Cell>
  );
}
