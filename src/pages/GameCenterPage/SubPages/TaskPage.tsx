import { TaskList } from "@/components/TaskList/TaskList";
import { GameDashFun } from "@/constats";
import { Title } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import ProfileHeader from "../Components/ProfileHeader";

export const GameCenter_TaskPage: FC = () => {
	//const { gamelist, updateGameList, loading } = useGameCenterData();

	return <div id="GameCenter_TaskPage" className="w-full flex flex-col py-4">
		<div className="w-full flex flex-col px-4">
			<ProfileHeader />
			<Title weight="2" className="py-4 w-full text-center">Tasks</Title>
		</div>

		<TaskList game={GameDashFun} user={null} onTaskClicked={t => {
			console.log(t);
		}} />
	</div >
}
