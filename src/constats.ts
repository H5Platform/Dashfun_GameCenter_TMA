import dashfunIcon from "./icons/dashfun-icon.svg";


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
	Claimed: 4
}

export const TaskRewardType = {
	DashFunToken: 1,//奖励DashFunToken
	DashFunChainToken: 2
}

export const TaskCategory = {
	Challenges: 1,
	Daily: 2,
}

export const TaskCategoryText: { [key: number]: string } = {
	1: "Challenges",
	2: "Daily Hunt"
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
	can_withdraw: boolean                //是否可以提取
	min_withdraw: number             //最低提取金额
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

export const getCoinIcon = (coinName: string) => {
	switch (coinName) {
		case "DashFunCoin":
			return dashfunIcon;
		default:
			return dashfunIcon;
	}
}