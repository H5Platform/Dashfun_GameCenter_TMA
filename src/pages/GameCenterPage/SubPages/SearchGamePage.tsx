import { Button, Input } from "@telegram-apps/telegram-ui";
import { Search, X } from "lucide-react";
import { FC, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const GameCenter_SearchPage: FC = () => {
	return <div id="GameCenter_SearchPage" className="w-full flex flex-col p-4">
		<Header />
	</div>
}

const Header: FC = () => {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);

	return <div className="flex flex-row items-center w-full gap-2">
		<div className="flex-1">
			<Input
				ref={inputRef}
				id="inputSearchGame"
				placeholder="Search Games"
				before={<Search strokeWidth={2} absoluteStrokeWidth color="gray" />}
				after={<X color="gray" absoluteStrokeWidth strokeWidth={4} />}
				autoFocus={true}
				tabIndex={-1}
			/>
		</div>
		<Button mode="plain" size="m" onClick={() => {
			navigate("/game-center/main")
		}}>Cancel</Button>
	</div>
}