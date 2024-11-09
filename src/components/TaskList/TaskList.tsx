import { GameData } from "@/components/DashFunData/GameData";
import { DashFunUser } from "@/components/DashFunData/UserData";
import { TaskApi, TGLink } from "@/utils/DashFunApi";
import { useLaunchParams, useUtils } from "@telegram-apps/sdk-react";
import { Avatar, Button, Cell, CircularProgress, List, Section, Text } from "@telegram-apps/telegram-ui";
import { FC, useEffect, useState } from "react";

import { getCoinIcon, Task, TaskCategoryText, TaskCondition, TaskRewardType, TaskSave, TaskStatus } from "@/constats";
import { TaskStatusChangedEvent } from "../Event/Events";
import "./TaskList.css";
import { UseDashFunCoins } from "../DashFun/DashFunCoins";

export type TaskListype = {
	game: GameData | null
	user: DashFunUser | null
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

export const getTaskRewardIcon = (rewardType: number) => {
	switch (rewardType) {
		case TaskRewardType.DashFunPoint:
			return getCoinIcon("DashFunPoint");
		default:
			return getCoinIcon("DashFunCoin");
	}
}

export const TaskList: FC<TaskListype> = (params) => {
	const { game, onTaskClicked } = params;
	const [tasks, setTasks] = useState([])
	const [taskSaves, setTaskSaves] = useState<{ [key: string]: TaskSave }>({})
	const initDataRaw = useLaunchParams().initDataRaw;

	const getTasks = async () => {
		if (game != null) {
			const r = await TaskApi.getTaskList(initDataRaw as string, game.id);
			console.log("tasks:", r)
			setTasks(r.tasks)
			setTaskSaves(r.user_data)
		}
	}

	useEffect(() => {
		getTasks();
	}, [game])


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

	return <List>
		{sections}
	</List>

	// console.log("taskpage:", user, game)
	// return <div className="flex flex-col gap-2">
	// 	{items}
	// </div>
}

const TaskListItem: FC<{ task: Task, save: TaskSave, game: GameData, onClicked: (item: { task: Task, save: TaskSave, processed: boolean }) => void }> = ({ task, save, game, onClicked }) => {

	let progress = null;
	const util = useUtils();
	const coins = UseDashFunCoins();
	const initDataRaw = useLaunchParams().initDataRaw;
	const [claiming, setClaiming] = useState(false);
	const [verifying, setVerifying] = useState(false);

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
			progress = <div className="flex flex-row gap-1 justify-center items-center">
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
				{
					getTaskLink(task) == "" ? <div className="w-[10px]"></div> : <i className="fa-solid fa-chevron-right"></i>
				}
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
			progress = <div className="w-[70px] h-[70px] flex justify-center items-center">
				<i className="fa-solid fa-circle-check fa-xl" style={{ color: "#63E6BE" }}></i>
			</div>
	}

	const onTaskClicked = () => {
		console.log("tesk clicked", task)
		let processed = false;
		if (save.status == TaskStatus.InProgress || save.status == TaskStatus.Verify_Pending) {
			const link = getTaskLink(task);
			if (link != "") {
				if (link.startsWith("https://t.me")) {
					util.openTelegramLink(link)
				} else {
					util.openLink(link)
				}
				TaskApi.onTaskClicked(initDataRaw as string, game.id, task.id).then(r => {
					console.log("on task clicked:", r)
				});
				processed = true;
				TaskStatusChangedEvent.fire(task.id, save.status);
			}
		}
		if (onClicked != null) {
			onClicked({ task, save, processed })
		}
	}

	let coin = null;

	switch (task.reward.reward_type) {
		case TaskRewardType.DashFunPoint:
			coin = coins.findCoinByName("DashFunPoint");
			break;
		case TaskRewardType.DashFunToken:
			coin = coins.findCoinByName("DashFunCoin");
			break;
		case TaskRewardType.GamePoint:
			coin = coins.findCoinByGameId(game.id);
			break;
	}

	return <Cell
		subtitle={`+${task.reward.amount} ${coin?.coin.symbol}`}
		before={<Avatar src={getCoinIcon(coin?.coin.name || "")} size={40} />}
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