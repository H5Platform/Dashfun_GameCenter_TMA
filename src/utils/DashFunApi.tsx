import { GameData, GameDataList, GameDataParams } from "@/components/DashFunData/GameData"
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

export const getImageUrl = (id: string | undefined, url: string | undefined) =>
	`https://res.dashfun.games/images/${id}/${url}`;


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
	// return api_test;
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
	},

	bindWalletAddress: async (tgToken: string, address: string): Promise<any> => {
		const api = UserApi.apiUrl() + "bind_wallet"
		const result = await axios.post(api, {
			chain: "Ton",
			address
		}, {
			headers: {
				"Authorization": "tma " + tgToken
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data
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

			console.log("decoded url::::", url);
			return new GameData({
				id: "ForTest",
				name: "Test Game",
				desc: "Only For Test -- " + url,
				mainPicUrl: "",
				logoUrl: "logo.png",
				url: url,
				genre: [1],
				iconUrl: "icon.png",
				time: 0,
				openTime: 0,
				status: 1,
				suggest: 0,
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
	},

	getTestingGames: async (tgToken: string) => {
		const api = GameApi.apiUrl() + "testing"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data;
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	},

	/**
	 * 保存数据接口，供游戏将本地数据保存到dashfun服务器
	 * @param gameId 
	 * @param tgToken 
	 * @param saveData 
	 * @returns 
	 */
	setData: async (gameId: string, tgToken: string, key: string, data: any) => {
		const api = GameApi.apiUrl() + gameId + "/data"

		let strToEncode = "";
		if (typeof (data) == "string") {
			strToEncode = data;
		} else {
			strToEncode = JSON.stringify(data);
		}

		// const encoded = btoa(strToEncode);

		console.log(typeof (data), strToEncode)

		const result = await axios.post(api, {
			key, data: strToEncode
		}, {
			headers: {
				"Authorization": "tma " + tgToken
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	},

	/**
	 * 读取数据接口，供游戏从dashfun服务器读取数据,返回的数据是data:string
	 * @param gameId 
	 * @param tgToken 
	 * @param key 
	 * @returns 
	 */
	getData: async (gameId: string, tgToken: string, key: string) => {
		console.log("GetData:", gameId, key)
		const api = GameApi.apiUrl() + gameId + "/data"


		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				key
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	},


	/**
	 * 读取数据接口，供游戏从dashfun服务器读取数据，返回的数据是{key:string, data:string}
	 * @param gameId 
	 * @param tgToken 
	 * @param key 
	 * @returns 
	 */
	getDataV2: async (gameId: string, tgToken: string, key: string) => {
		console.log("GetData:", gameId, key)
		const api = GameApi.apiUrl() + gameId + "/data_v2"


		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				key
			}
		})
		if (result.status == 200) {
			if (result.data.code == 0) {
				return result.data.data
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	},

	gameSearch: async (tgToken: string, keyword: string = "", page: number = 1, genre: number[] = [], size: number = 10): Promise<GameDataList> => {
		const api = GameApi.apiUrl() + "search"
		const result = await axios.post(api, {
			keyword,
			genre,
			size,
			page

		}, {
			headers: {
				"Authorization": "tma " + tgToken
			},
		},
		)
		console.log("gameSearch:", result)
		if (result.status == 200) {
			if (result.data.code == 0) {
				if (result.data.data && result.data.data.data) {
					const data = result.data.data.data.map((item: GameDataParams) => new GameData(item));
					return new GameDataList(data, result.data.page, result.data.size, result.data.total_pages);
				} else {
					throw result.data.msg
				}
			} else {
				throw result.data.msg
			}
		} else {
			throw result.status
		}
	},

	getGameList: async (tgToken: string, listTypes: number[] = []) => {
		const api = GameApi.apiUrl() + "game_list"
		const result = await axios.get(api, {
			headers: {
				"Authorization": "tma " + tgToken
			},
			params: {
				list_type: listTypes
			}
		})
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
