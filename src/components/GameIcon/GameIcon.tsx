import { FC } from "react"
import { GameData } from "../DashFunData/GameData"

export const GameIcon: FC<{ game: GameData | undefined, size: number, onClick?: () => void }> = ({ game, size, onClick }) => {
	return <div className=" items-center rounded-xl relative cursor-pointer" onClick={onClick} style={{ minWidth: size, width: size, height: size, backgroundColor: "var(--tgui--tertiary_bg_color)", boxShadow: "0 0 0 1px var(--tgui--outline)" }} >
		<img src={game?.getIconUrl()} className="w-full h-full block object-cover absolute " style={{ borderRadius: "inherit" }} />
	</div>
}