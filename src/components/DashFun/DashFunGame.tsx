import { Env, GameApi, getEnv } from "@/utils/DashFunApi";
import { useInitData, useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { GameData } from "../DashFunData/GameData";

const useDashFunGame = (): GameData | null => {
	const [game, setGame] = useState<GameData | null>(null)
	const initData = useInitData();
	const initDataRaw = useLaunchParams().initDataRaw;

	const loadGame = async (gameId: string | undefined): Promise<GameData | undefined> => {
		if (gameId == null) {
			return undefined;
		}
		const game = await GameApi.findGame(gameId, initDataRaw as string)
		setGame(game);
		console.log("game loaded:", game)
	}

	useEffect(() => {
		let gameId = initData?.startParam;
		if (getEnv() != Env.Prod) {
			if (gameId == null) {
				gameId = "LocalTest"
			}
		}
		loadGame(gameId);
	}, [initData?.startParam, initDataRaw])

	return game;
}

export { useDashFunGame };
