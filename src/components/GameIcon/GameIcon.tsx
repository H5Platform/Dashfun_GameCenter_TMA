import { FC } from "react"
import { GameData } from "../DashFunData/GameData"
import { TGLink } from "@/utils/DashFunApi"
import { openTelegramLink } from "@telegram-apps/sdk-react"

export const GameIcon: FC<{
	game: GameData | undefined,
	size: number,
	openGameOnClick?: boolean,
	onClick?: () => void
}> = ({ game, size, openGameOnClick = true, onClick }) => {
	return <div className=" items-center rounded-xl relative cursor-pointer" onClick={() => {
		if (openGameOnClick) {
			if (game != null) {
				const url = TGLink.gameLink(encodeURIComponent(game.id));
				openTelegramLink(url);
			}
		}
		if (onClick != null) {
			onClick();
		}
	}} style={{ minWidth: size, width: size, height: size, backgroundColor: "var(--tgui--tertiary_bg_color)", boxShadow: "0 0 0 1px var(--tgui--outline)" }} >
		<img src={game?.getIconUrl()} className="w-full h-full block object-cover absolute " style={{ borderRadius: "inherit" }} />
	</div>
}