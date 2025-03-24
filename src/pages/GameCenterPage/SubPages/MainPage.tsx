import { GameData, GameListType } from "@/components/DashFunData/GameData";
import { TGLink } from "@/utils/DashFunApi";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { Button } from "@telegram-apps/telegram-ui";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameCenterData } from "../Components/GameCenterDataProvider";

import ProfileHeader from "../Components/ProfileHeader";


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
		<div className="py-2 font-semibold text-2xl w-full text-center text-white">Games</div>
		<div className="w-full grid grid-cols-3 gap-1 pb-8 min-h-full">
			{games.map((game, index) => {
				return <GameCard key={index} game={game} width={(pageWidth - 8) / 3} />
			})}
		</div>

		<div className="w-full flex items-center justify-between bg-white bg-opacity-10 rounded-2xl px-4 py-2">
			<span className=" text-white">Join Community</span>
			<Button mode="filled" size="s" onClick={() => {
				openTelegramLink("https://t.me/dashfungroup");
			}}>Join</Button>
		</div>

		<div className="w-full flex items-center justify-center py-2">
			<Button mode="filled" size="s" onClick={() => {
				nav("/game-center/games");
			}}>SEE ALL GAMES</Button>
		</div>
	</div>
}

const GameCard: FC<{ game: GameData, width: number }> = ({ game, width }) => {
	return <div className=" flex flex-col rounded-2xl p-2 bg-white bg-opacity-10" style={{ width: width }}>
		<img src={game?.getLogoUrl()} className="object-cover rounded-2xl" style={{ width: width - 16, height: width - 16 }} />
		<span className="text-sm truncate overflow-hidden min-w-0 py-1 text-white">{game?.name}</span>
		<div className="w-full text-center text-sm font-semibold py-1 bg-white bg-opacity-20 rounded-full text-white" onClick={() => {
			const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
			openTelegramLink(url);
		}}>PLAY</div>
	</div>
}

