import { GameData } from "@/components/DashFunData/GameData";
import { getImageUrl } from "@/utils/DashFunApi";
import { Button, Cell } from "@telegram-apps/telegram-ui";
export type GameListItemInfo = {
  img: string,
  name: string
}

export default function GameListItem({ data }: { data: GameData }) {

  return (
    <Cell
      before={
        <img
          src={getImageUrl(data.id, data.iconUrl)}
          alt="game image"
          className="rounded-lg w-[50px] object-contain aspect-contain"
        />
      }
      after={
        <Button size="s" mode="bezeled" className="px-4">
          PLAY
        </Button>
      }
      subtitle={data.desc}
      //   style={{ padding: 0, gap: 10 }}
      className="no-padding-cell"
    >
      {data.name}
    </Cell>
  );
}
