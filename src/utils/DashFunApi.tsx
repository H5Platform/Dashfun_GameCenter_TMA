import { GameData } from "@/components/DashFunData/GameData"
import { DashFunUser } from "@/components/DashFunData/UserData"
import axios from "axios"

const api_local = "https://tma-server-test.nexgami.com/api/v1/"
const api_test = "https://dashfun-server-test.nexgami.com/api/v1/"
const api_prod = "https://dashfun.nexgami.com/api/v1/"

const api_url = () => {
	const url = window.location.href;
	console.log("api_url.url===", url);
	if (url.indexOf("https://dashfun-test") >= 0) {
		return api_test;
	}
	if (url.indexOf("https://dashfun") >= 0) {
		return api_prod;
	}
	return api_local;
}


const dashFunApiUrl = api_url()

const UserApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "user/"
	},

	tgLogin: async (tgToken: string): Promise<DashFunUser> => {
		const api = UserApi.apiUrl() + "tg_login"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return new DashFunUser(result.data.data)
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	}
}

const GameApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "game/"
	},
	findGame: async (gameId: string, tgToken: string): Promise<GameData> => {
		const api = GameApi.apiUrl() + gameId
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return new GameData(result.data.data);
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	}
}

const PaymentApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "payment/"
	},

	requestPayment: async (tgToken: string, request: { game_id: string, title: string, desc: string, payload: string, price: number }) => {
		const api = PaymentApi.apiUrl() + "request"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: request
		});
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	}
}

export { GameApi, PaymentApi, UserApi }
