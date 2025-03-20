import { GameData } from "@/components/DashFunData/GameData";
import { DashFunUser } from "@/components/DashFunData/UserData";
import { getImageUrl, TaskApi, TGLink, UserApi } from "@/utils/DashFunApi";
import { openLink, openTelegramLink, useLaunchParams } from "@telegram-apps/sdk-react";
import { Avatar, Button, Cell, CircularProgress, Image, Text } from "@telegram-apps/telegram-ui";
import { FC, useEffect, useState } from "react";

import { CoinInfo, getCoinIcon1, GetTaskIcon, Task, TaskCategory, TaskCategoryText, TaskCondition, TaskRewardType, TaskSave, TaskStatus } from "@/constats";
import { useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import { ChevronRight, CircleCheckBig } from "lucide-react";
import { useDashFunCoins } from "../DashFun/DashFunCoins";
import { TaskStatusChangedEvent } from "../Event/Events";
import Section from "../Section/Section";
import "./TaskList.css";

export type TaskListype = {
	game: GameData | null
	user: DashFunUser | null
	tasksData?: { tasks: any[], user_data: { [key: string]: TaskSave } } | null
	onTaskClicked: (params: { task: Task, save: TaskSave, processed: boolean }) => void
}

const getTaskLink = (task: Task): string => {
	if (task.require.link != "") {
		return task.require.link;
	}
	if (task.require.type == TaskCondition.PlayGame) {
		const link = TGLink.gameLink(task.game_id);
		console.log(task, link);
		return link;
	}
	if (task.require.type == TaskCondition.PlaySpecificGame) {
		const link = TGLink.gameLink(task.require.condition);
		console.log(task, link);
		return link;
	}
	if (task.require.type == TaskCondition.BindWallet) {
		return "openwallet:ton"
	}
	return ""
}

// export const getTaskRewardText = (taskRewardType: number) => {
// 	switch (taskRewardType) {
// 		case TaskRewardType.DashFunPoint:
// 			return "DashFun Point"
// 		default:
// 			return "Point"
// 	}
// }

export const getTaskCategoryText = (taskCategory: number) => {
	return TaskCategoryText[taskCategory] || ""

}

export const TaskList: FC<TaskListype> = ({ game, onTaskClicked, tasksData = null }) => {
	const [tasks, setTasks] = useState<Task[]>([])
	const [taskSaves, setTaskSaves] = useState<{ [key: string]: TaskSave }>({})
	const initDataRaw = useLaunchParams().initDataRaw;

	const getTasks = async () => {
		if (game != null) {
			const r = await TaskApi.getTaskList(initDataRaw as string, game.id);
			console.log("tasks:", r)
			const tasklist = r.tasks;
			tasklist.sort((a: Task, b: Task) => {
				const saveA = r.user_data[a.id];
				const saveB = r.user_data[b.id];
				//已领取的任务排在最后，归类改为Done
				if (saveA.status == TaskStatus.Claimed) {
					a.category = TaskCategory.Done;
					return 1;
				} else if (saveB.status == TaskStatus.Claimed) {
					b.category = TaskCategory.Done;
					return -1;
				} else if (a.category != b.category) {
					return a.category - b.category;
				} else if (saveA.status !== saveB.status) {
					return saveB.status - saveA.status;
				}

				return b.create_time - a.create_time;
			});
			setTasks(tasklist)
			setTaskSaves(r.user_data)
		}
	}

	useEffect(() => {
		console.log("tasklist:", game, tasksData)
		if (tasksData == null) {
			getTasks();
		} else {
			setTasks(tasksData.tasks)
			setTaskSaves(tasksData.user_data)
		}
	}, [game, tasksData])


	const sections = []
	let items = []
	let currCategory: number = -1;

	if (tasks != null) {
		for (let index = 0; index < tasks.length; index++) {
			const task = tasks[index] as Task;
			if (currCategory == -1) {
				currCategory = task.category
				items = []
			}
			if (currCategory != -1 && currCategory != task.category) {
				//category变化了
				const section = <Section key={"section_" + currCategory} header={getTaskCategoryText(currCategory)}>
					{items}
				</Section>
				sections.push(section);
				items = [];
				currCategory = task.category;
			}
			const save = taskSaves[task.id]
			items.push(<TaskListItem key={task + "_" + task.id} task={task} save={save} game={game as GameData} onClicked={(item) => {
				if (item.processed) {
					setTaskSaves({ ...taskSaves, [task.id]: item.save })
				}
				if (onTaskClicked != null) {
					onTaskClicked(item)
				}
			}} />)
		}
		if (items.length > 0) {
			const section = <Section key={"section_" + currCategory} header={getTaskCategoryText(currCategory)}>
				{items}
			</Section>
			sections.push(section)
		}
	}

	return <div className="flex flex-col gap-2 px-4">
		{sections}
	</div>

	// console.log("taskpage:", user, game)
	// return <div className="flex flex-col gap-2">
	// 	{items}
	// </div>
}

const TaskListItem: FC<{ task: Task, save: TaskSave, game: GameData, onClicked: (item: { task: Task, save: TaskSave, processed: boolean }) => void }> = ({ task, save, game, onClicked }) => {

	let progress = null;
	const initDataRaw = useLaunchParams().initDataRaw;
	const [claiming, setClaiming] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const { state, open, close } = useTonConnectModal();

	const [_1, _2, _3, getCoinInfo] = useDashFunCoins();

	if (task.require.type == TaskCondition.BindWallet) {
		const [ui] = useTonConnectUI();
		ui.onStatusChange(w => {
			if (w != null) {
				UserApi.bindWalletAddress(initDataRaw as string, w.account.address)
				if (state.status == 'opened') {
					close();
				}
			}
		})
	}

	const claim = async () => {
		if (save.status == TaskStatus.Completed) {
			setClaiming(true);
			const r = await TaskApi.claimReward(initDataRaw as string, game.id, task.id);
			console.log("claim result:", r);
			save.status = r.status;
			setClaiming(false);
			TaskStatusChangedEvent.fire(task.id, r.status);
		}
	}

	const verify = async () => {
		if (save.status == TaskStatus.Verify_Pending) {
			setVerifying(true);
			try {
				const r = await TaskApi.verifyTask(initDataRaw as string, game.id, task.id);
				save.status = r.status;
				const time = Math.random() * 2000 + 4000
				console.log("verify result:", r, time);
				setTimeout(() => {
					setVerifying(false);
					TaskStatusChangedEvent.fire(task.id, r.status);
				}, time);
			} finally {
				setTimeout(() => {
					setVerifying(false);
				}, 5000);
			}
		}
	}


	switch (save.status) {
		case TaskStatus.InProgress:
		case TaskStatus.ReturnInProgress:
			progress = <div className="flex flex-col w-full justify-center items-center">
				<div className="flex flex-row justify-center items-center">
					{
						task.require.type == TaskCondition.BindWallet && task.require.condition == "Ton" ?
							<Button mode="filled" size="m"><img src="/ton-toncoin-logo-1.svg" /></Button> :
							<div className=" relative w-[50px] h-[50px]">
								<div className=" absolute left-[-3px] top-[-3px]">
									<CircularProgress
										progress={save.progress / task.require.count * 100}
										size="large"
									/>
								</div>
								<div className="w-[50px] h-[50px] absolute top-0 left-0">
									<Text className=" text-center items-center justify-center flex w-full h-full text-sm font-semibold">
										{save.progress}/{task.require.count}
									</Text>
								</div>
							</div>
					}
					{
						getTaskLink(task) == "" ? <div className="w-6"></div> : (
							task.require.type == TaskCondition.BindWallet ? <div className="w-[10px]"></div> :
								<ChevronRight strokeWidth={2} />
						)
					}
				</div>
			</div>
			break;
		case TaskStatus.Verify_Pending:
			progress = <>
				<Button
					mode="filled"
					size="s"
					onClick={(evt) => {
						evt.stopPropagation()
						verify()
					}}
					loading={verifying}
				>
					VERIFY
				</Button>
			</>
			break;
		case TaskStatus.Completed:
			progress = <>
				<Button
					mode="filled"
					size="s"
					onClick={(evt) => {
						evt.stopPropagation()
						claim()
					}}
					loading={claiming}
				>
					CLAIM
				</Button>
			</>
			break;
		case TaskStatus.Claimed:
			progress = <div className="w-[56px] h-[56px] flex justify-center items-center pr-4">
				<CircleCheckBig color="#63E6BE" strokeWidth={2} />
			</div>
	}

	const onTaskClicked = () => {
		console.log("tesk clicked", task)
		let processed = false;
		if (save.status == TaskStatus.InProgress || save.status == TaskStatus.ReturnInProgress || save.status == TaskStatus.Verify_Pending) {
			const link = getTaskLink(task);
			if (link != "") {
				if (link.startsWith("https://t.me")) {
					openTelegramLink(link)
				} else if (link.startsWith("openwallet")) {
					open();
				} else {
					openLink(link)
				}
				TaskApi.onTaskClicked(initDataRaw as string, game.id, task.id).then(r => {
					console.log("on task clicked:", r)
				});
				processed = true;
				if (task.require.type == TaskCondition.FollowX || task.require.type == TaskCondition.JoinTGChannel) {
					save.status = TaskStatus.Verify_Pending;
				}
				TaskStatusChangedEvent.fire(task.id, save.status);
			}
		}
		if (onClicked != null) {
			onClicked({ task, save, processed })
		}
	}

	// let coin = null;

	// switch (task.reward.reward_type) {
	// 	case TaskRewardType.DashFunPoint:
	// 		coin = coins.findCoinByName("DashFunPoint");
	// 		break;
	// 	case TaskRewardType.DashFunToken:
	// 		coin = coins.findCoinByName("DashFunCoin");
	// 		break;
	// 	case TaskRewardType.GamePoint:
	// 		coin = coins.findCoinByGameId(game.id);
	// 		break;
	// }

	const rewardDom: JSX.Element[] = [];

	task.rewards?.forEach(reward => {
		let coinInfo: CoinInfo | null = null;
		switch (reward.reward_type) {
			case TaskRewardType.DashFunPoint:
				coinInfo = getCoinInfo("DashFunPoint", "name");
				break;
			case TaskRewardType.DashFunToken:
				coinInfo = getCoinInfo("DashFunCoin", "name");
				break;
			case TaskRewardType.GamePoint:
				coinInfo = getCoinInfo(game.id, "gameId");
				break;
		}

		if (coinInfo != null) {
			const dom = <div key={reward.reward_type} className="flex flex-row gap-1 items-center">
				<Avatar src={getCoinIcon1(coinInfo.coin)} size={24} />
				{reward.amount}
			</div>
			rewardDom.push(dom);
		}
	});


	return <Cell
		subtitle={<div className="flex flex-row gap-3">{rewardDom}</div>}
		//subtitle={`+${task.reward.amount} ${coin?.coin.symbol}`}
		before={<Image src={GetTaskIcon(task)} size={40} />}
		after={progress}
		onClick={() => {
			onTaskClicked()
		}}
	>
		{task.name}

	</Cell>


	// return <div className="bg-white rounded-xl flex flex-row py-4 px-6 gap-2">
	// 	<div className="bg-yellow-100 w-[50px] h-[50px]"></div>
	// 	<div className="flex flex-col justify-between">
	// 		<div className=" text-black text-lg">{task.name}</div>
	// 		<div className=" text-gray-400 text-sm">+{task.reward.amount} {getTaskRewardText(task.reward.reward_type)}</div>
	// 	</div>
	// 	<div className="flex flex-row flex-1 items-center justify-end">

	// 		{progress}
	// 	</div>
	// </div>
}