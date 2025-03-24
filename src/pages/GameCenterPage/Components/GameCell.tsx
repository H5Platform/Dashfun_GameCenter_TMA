import { GameData } from "@/components/DashFunData/GameData";
import { GameIcon } from "@/components/GameIcon/GameIcon";
import { TGLink } from "@/utils/DashFunApi";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { Headline, Caption, Button } from "@telegram-apps/telegram-ui";
import { FC } from "react";

const GameCell: FC<{ game: GameData | undefined }> = ({ game }) => {
	return <div className="w-full relative py-2  flex flex-row justify-start items-center pr-4">
		<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }} openGameOnClick={false} />
		<div className="flex flex-col px-2 flex-1 w-full min-w-0">
			<Headline weight="3" className="min-w-0 truncate flex-shrink-0">{game?.name}</Headline>
			<Caption className="min-w-0" style={{ height: 38, color: "var(--tgui--hint_color)", overflow: "hidden", textOverflow: "ellipsis" }}>{game?.desc}</Caption>
		</div>
		<Button mode="bezeled" size="s" className=" w-[70px]" onClick={() => {
			const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
			openTelegramLink(url);
		}}>Play</Button>
	</div>
}

export default GameCell;