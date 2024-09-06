import { Coin, CoinInfo, CoinUserData, TaskStatus } from "@/constats"
import { CoinApi } from "@/utils/DashFunApi"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useEffect, useState } from "react"
import { TaskStatusChangedEvent } from "../Event/Events"

export type DashFunCoins = {
	findCoinById: (id: string) => CoinInfo | null
	findCoinByName: (name: string) => CoinInfo | null
}


export const UseDashFunCoins = (): DashFunCoins => {
	const [coins, setCoins] = useState<Coin[]>([])
	const [userData, setUserData] = useState<{ [key: string]: CoinUserData } | null>(null)
	const initDataRaw = useLaunchParams().initDataRaw;

	const getCoins = async () => {
		const result = await CoinApi.getCoins(initDataRaw as string) as { coins: Coin[], user_data: { [key: string]: CoinUserData } }
		console.log("get coin result:", result)
		setCoins(result.coins);
		setUserData(result.user_data);
	}

	useEffect(() => {
		getCoins()
	}, [])

	useEffect(() => {
		const evtListener = (taskId: string, status: number) => {
			console.log(taskId);
			if (status == TaskStatus.Claimed) {
				//任务变为已领取，需要刷新用户的coin余额
				console.log("request get coin balance.....")
				getCoins();
			}
		}

		TaskStatusChangedEvent.addListener(evtListener);
		return () => TaskStatusChangedEvent.removeListener(evtListener);

	}, [coins]);

	const findCoin = (s: string, p: "id" | "name" = "id") => {
		for (let i = 0; i < coins.length; i++) {
			const c = coins[i];
			const pc = p == "id" ? c.id : c.name
			if (pc == s) {
				return c;
			}
		}
		return null;
	}



	const ret: DashFunCoins = {
		findCoinById: function (id: string) {
			if (coins == null || userData == null) return null;
			const coin = findCoin(id);
			if (coin == null) {
				return null;
			}
			const save = userData[coin.id];

			return {
				coin: coin,
				userData: save
			}
		},
		findCoinByName: function (name: string) {
			if (coins == null || userData == null) return null;
			const coin = findCoin(name, "name");
			if (coin == null) {
				return null;
			}
			const save = userData[coin.id];

			return {
				coin: coin,
				userData: save
			}
		}
	}

	return ret
}