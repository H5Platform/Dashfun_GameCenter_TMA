import { Env, GameApi, getEnv } from "@/utils/DashFunApi";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { GameData } from "../DashFunData/GameData";
import { useLocation } from "react-router-dom";

export const useDashFunGame = (): GameData | null => {
	const [game, setGame] = useState<GameData | null>(null)
	const l = useLocation();

	let gameId = useSignal(initData?.startParam);
	if (gameId == null && l.search != "" && getEnv() != Env.Prod) {
		//非正式环境下可以读取游戏url
		const url = l.search.slice(1);
		const encoded = btoa(url)
		gameId = "test-" + encoded;
	}
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

