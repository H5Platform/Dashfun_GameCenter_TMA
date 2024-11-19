import dashfunIcon from "./icons/dashfun-icon.svg";
import dashfunPointIcon from "./icons/dashfun-point-icon.png";
import w3kPointIcon from "./icons/w3k-point-icon.png";


//Task
export type Task = {
	id: string
	game_id: string
	category: number
	name: string
	open: boolean
	task_type: number
	require: {
		condition: string
		count: number
		link: string
		type: number
	}
	reward: {
		amount: number
		reward_type: number
	}
}

export const TaskType = {
	Normal: 1,
	Daily: 2,
	TwoDays: 3
}

export const TaskCondition = {
	PlayRandomGame: 1,
	PlayGame: 2,
	LevelUp: 3,
	JoinTGChannel: 4,
	FollowX: 5
}

export const TaskStatus = {
	InProgress: 1,//任务正在进行中
	Verify_Pending: 2,                       //任务需要验证
	Completed: 3,                         //任务完成
	Claimed: 4,
	ReturnInProgress: 5,//专门给follow x类型使用的状态，视为InProgress
}

export const TaskRewardType = {
	DashFunToken: 1,//奖励DashFunToken
	DashFunPoint: 2,
	GamePoint: 3, //奖励游戏对应的点数
}

export const TaskCategory = {
	Challenges: 1,
	Daily: 2,
}

export const TaskCategoryText: { [key: number]: string } = {
	1: "Challenges",
	2: "Daily Hunt",
	3: "7 Days Challenges"
}

export type TaskSave = {
	progress: number
	save_data: string
	status: number
	task_id: string
	user_id: string
	time: number
}

//Coin
export type Coin = {
	id: string
	name: string
	symbol: string
	desc: string
	bind_game_id: string 				//绑定的游戏id
	can_withdraw: boolean				//是否可以提取
	min_withdraw: number             	//最低提取金额
	chain_addr: { [key: string]: string }      //链上地址，chainName->address
}

export type CoinUserData = {
	coin_id: string
	user_id: string
	amount: number
	create_time: number
}

export type CoinInfo = {
	coin: Coin,
	userData: CoinUserData
}

export const getCoinIcon = (coinName: "DashFunCoin" | "DashFunPoint" | "W3KPoint" | string) => {
	console.log("get coin icon:", coinName)
	switch (coinName) {
		case "DashFunCoin":
			return dashfunIcon;
		case "DashFunPoint":
			return dashfunPointIcon;
		case "W3KPoint":
			return w3kPointIcon;
		default:
			return "";
	}
}