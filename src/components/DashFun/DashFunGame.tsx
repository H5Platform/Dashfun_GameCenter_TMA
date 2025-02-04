import { Env, GameApi, getEnv } from "@/utils/DashFunApi";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { GameData } from "../DashFunData/GameData";

export const useDashFunGame = (): GameData | null => {
	const [game, setGame] = useState<GameData | null>(null)
	let gameId = useSignal(initData?.startParam);
	const lp = useLaunchParams();
	const initDataRaw = lp.initDataRaw;

	const loadGame = async (gameId: string | undefined): Promise<GameData | undefined> => {
		if (gameId == null) {
			return undefined;
		}
		const game = await GameApi.findGame(gameId, initDataRaw as string)
		setGame(game);
		console.log("game loaded:", game)
	}

	useEffect(() => {
		if (getEnv() != Env.Prod) {
			if (gameId == null) {
				gameId = "LocalTest"
			}
		}
		loadGame(gameId);
	}, [initData?.startParam, initDataRaw, gameId])

	return game;
}

