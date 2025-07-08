import { GameData, GameListType } from "@/components/DashFunData/GameData";
import { TGLink } from "@/utils/DashFunApi";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameCenterData } from "../Components/GameCenterDataProvider";

import ProfileHeader from "../Components/ProfileHeader";
import { DFButton, DFLabel } from "@/components/controls";
import { Web3Provider } from "@/components/Wallet/airdrop_contract";
import { TGECountDown } from "../Components/TGECountDown";


export const GameCenter_MainPage: FC = () => {
	const nav = useNavigate();
	const [pageWidth, setPageWidth] = useState(window.innerWidth);
	useEffect(() => {
		const handleResize = () => {
			let w = window.innerWidth;
			if (w > 640) w = 640;
			w -= 32; // 16px padding
			setPageWidth(w);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const { gamelist } = useGameCenterData();
	const games: GameData[] = [];

	const addGame = (g: GameData | null | undefined) => {
		if (g != null && games.length < 9) {
			if (games.find((game) => game.id === g.id) != null) return;
			games.push(g);
		}
	}

	gamelist?.game_list[GameListType.Banner]?.forEach((gameId) => {
		const g = gamelist?.getGame(gameId);
		addGame(g);
	});
	gamelist?.game_list[GameListType.Suggest]?.forEach((gameId) => {
		const g = gamelist?.getGame(gameId);
		addGame(g);
	});
	gamelist?.game_list[GameListType.Popular]?.forEach((gameId) => {
		const g = gamelist?.getGame(gameId);
		addGame(g);
	});
	gamelist?.game_list[GameListType.New]?.forEach((gameId) => {
		const g = gamelist?.getGame(gameId);
		addGame(g);
	});


	return <div id="GameCenter_MainPage" className="w-full p-4 min-h-full flex flex-col gap-2">
		<ProfileHeader />

		<Web3Provider>
			<div className="w-full flex items-center justify-center py-2">
				<TGECountDown showCheckBtn />
			</div>
		</Web3Provider>

		<div className="w-full pt-4">
			<DFLabel>
				<div className="w-full flex justify-between pl-4 items-center">
					<p>Join Community</p>
					<DFButton className="w-20" onClick={() => {
						openTelegramLink("https://t.me/dashfungroup");
					}}>Join</DFButton>
				</div>
			</DFLabel>
		</div>

		<div className="w-full flex items-center justify-center py-2">
			<DFButton size="m" onClick={() => {
				nav("/game-center/games");
			}}>SEE ALL GAMES</DFButton>
		</div>

		<div className="w-full grid grid-cols-3 gap-2 pb-8 min-h-full">
			{games.map((game, index) => {
				return <GameCard key={index} game={game} width={(pageWidth - 8) / 3} />
			})}
		</div>

	</div>
}

const GameCard: FC<{ game: GameData, width: number }> = ({ game }) => {
	return <div className="relative rounded-xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#1E6493] to-[#0C3D63]">
		{/* 发光边缘层 */}
		<div className="absolute inset-0 rounded-xl ring-1 ring-blue-400/50 pointer-events-none z-0"></div>

		{/* 内容层 */}
		<div className="relative">
			{/* 游戏图片块：带明显内陷效果 */}
			<div className="relative w-full aspect-square rounded-lg overflow-hidden">
				<img
					src={game?.getLogoUrl()}
					className="w-full h-full object-cover opacity-90"
				/>

				<div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/40 to-transparent rounded-t-lg pointer-events-none"></div>
				<div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/40 to-transparent rounded-l-lg pointer-events-none"></div>
				<div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/40 to-transparent rounded-r-lg pointer-events-none"></div>
				<div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/40 to-transparent rounded-b-lg pointer-events-none"></div>
			</div>

			{/* 游戏标题 */}
			<div className="text-sm truncate overflow-hidden min-w-0 py-1 text-white font-semibold text-center">{game?.name}</div>

			{/* 按钮 */}
			<DFButton size="s" onClick={() => {
				const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
				openTelegramLink(url);
			}}>PLAY</DFButton>
		</div>
	</div >
}

// const GameCard2: FC<{ game: GameData, width: number }> = ({ game, width }) => {
// 	return <div className=" flex flex-col rounded-2xl p-2 bg-white bg-opacity-10" style={{ width: width }}>
// 		<img src={game?.getLogoUrl()} className="object-cover rounded-2xl" style={{ width: width - 16, height: width - 16 }} />
// 		<span className="text-sm truncate overflow-hidden min-w-0 py-1 text-white">{game?.name}</span>
// 		<div className="w-full text-center text-sm font-semibold py-1 bg-white bg-opacity-20 rounded-full text-white" onClick={() => {
// 			const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
// 			openTelegramLink(url);
// 		}}>PLAY</div>
// 	</div>
// }

