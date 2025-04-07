import { TaskList } from "@/components/TaskList/TaskList";
import { GameDashFun } from "@/constats";
import { FC, useState } from "react";
import ProfileHeader from "../Components/ProfileHeader";
import { useEffectOnActive } from "keepalive-for-react";
import { DFText } from "@/components/controls";

export const GameCenter_TaskPage: FC = () => {
	//const { gamelist, updateGameList, loading } = useGameCenterData();
	const [game, setGame] = useState(GameDashFun());

	useEffectOnActive(() => {
		//就是为了刷新用
		setGame(GameDashFun());
	}, [])

	return <div id="GameCenter_TaskPage" className="w-full flex flex-col py-4">
		<div className="w-full flex flex-col px-4">
			<ProfileHeader />
			<DFText weight="2" size="2xl" className="py-4 w-full text-center">Tasks</DFText>
		</div>

		<TaskList game={game} user={null} onTaskClicked={_ => {
		}} />
	</div >
}
