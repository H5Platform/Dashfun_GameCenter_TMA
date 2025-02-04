import { Input } from "@telegram-apps/telegram-ui";
import { FC } from "react";

export const GameCenterPage: FC = () => {
	return <div id="GameCenterPage" className="w-full flex flex-col p-4">
		<Header />
	</div>
}

const Header: FC = () => {

	return <div>
		<Input id="inputSearchGame" placeholder="Search Games"/>
	</div>
}