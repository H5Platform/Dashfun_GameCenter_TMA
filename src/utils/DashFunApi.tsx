import { GameData } from "@/components/DashFunData/GameData"
import { DashFunUser } from "@/components/DashFunData/UserData"
import axios from "axios"

enum Env {
	Dev,
	Test,
	Prod
}

let env: Env = Env.Test

const api_local = "https://tma-server-test.nexgami.com/api/v1/"
const api_test = "https://dashfun-server-test.nexgami.com/api/v1/"
const api_prod = "https://tma-server.dashfun.games/api/v1/"

const api_url = () => {
	const url = window.location.href;
	if (url.indexOf("https://dashfun-test") >= 0) {
		env = Env.Test

		return api_test;
	}
	if (url.indexOf("https://tma.dashfun.games") >= 0) {
		env = Env.Prod

		return api_prod;
	}
	env = Env.Dev
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
			},
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
	},

	enterGame: async (tgToken: string, gameId: string): Promise<DashFunUser> => {
		const api = UserApi.apiUrl() + "enter_game"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId
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

		if (gameId.startsWith("test-") /*&& env != Env.Prod*/) {
			//for test
			const encoded = gameId.slice("test-".length)
			const url = atob(encoded)
			console.log("encoded url::::", url);
			return new GameData({
				id: "ForTest",
				name: "Test Game",
				desc: "Only For Test",
				mainPicUrl: "",
				logoUrl: "",
				url: url,
				genre: [1],
				iconUrl: "",
				time: 0,
				openTime: 0,
			});
		}


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

const TaskApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "task/"
	},

	getTaskList: async (tgToken: string, gameId: string) => {
		const api = TaskApi.apiUrl() + "list"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	},

	onTaskClicked: async (tgToken: string, gameId: string, taskId: string) => {
		const api = TaskApi.apiUrl() + "clicked"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
				task_id: taskId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	},

	verifyTask: async (tgToken: string, gameId: string, taskId: string) => {
		const api = TaskApi.apiUrl() + "verify"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
				task_id: taskId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	},

	claimReward: async (tgToken: string, gameId: string, taskId: string) => {
		const api = TaskApi.apiUrl() + "claim"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
				task_id: taskId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	},

	/**
	 * 获取用于当前的任务状态数量
	 * @param tgToken 
	 * @param gameId 
	 * @returns 
	 */
	getCount: async (tgToken: string, gameId: string) => {
		const api = TaskApi.apiUrl() + "count"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	}
}

const CoinApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "coin/"
	},

	getCoins: async (tgToken: string) => {
		const api = CoinApi.apiUrl() + "get"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg
			}
		} else {
			throw result.status
		}
	}
}

const SpinWheelApi = {
	apiUrl: (): string => {
		return dashFunApiUrl + "spinwheel/"
	},

	getInfo: async (tgToken: string, gameId: string) => {
		const api = SpinWheelApi.apiUrl() + "get"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg;
			}
		} else {
			throw result.status
		}
	},

	spin: async (tgToken: string, gameId: string) => {
		const api = SpinWheelApi.apiUrl() + "spin"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg;
			}
		} else {
			throw result.status
		}
	},

	claim: async (tgToken: string, gameId: string) => {
		const api = SpinWheelApi.apiUrl() + "claim"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				game_id: gameId,
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				return result.data.msg;
			}
		} else {
			throw result.status
		}
	}

}

const tg_link = () => {
	let botName = "DashFunBot";

	switch (env) {
		case Env.Test:
			botName = "DashFunTestBot";
			break;
		case Env.Dev:
			botName = "LocalTestBot";
			break;
		case Env.Prod:
			botName = "DashFunBot";
			break;
	}
	return `https://t.me/${botName}`
}

const TGLink = {
	gameLink: (gameId: string) => {
		return `${tg_link()}/Games?startapp=${gameId}`
	},
	centerLink: () => {
		return `${tg_link()}/Center`
	},
	botLink: () => {
		return `${tg_link()}`
	},
	groupLink: () => {
		let link = "";
		switch (env) {
			case Env.Test:
				link = "https://t.me/+h79TJSlUaO03ZDdh"
				break;
			case Env.Dev:
				link = "https://t.me/dashfun_official";
				break;
			case Env.Prod:
				link = "https://t.me/dashfun_official";
				break;
		}
		return link
	}
}

const getEnv = () => {
	return env
}


export { GameApi, PaymentApi, UserApi, TGLink, TaskApi, CoinApi, SpinWheelApi, getEnv, Env }
