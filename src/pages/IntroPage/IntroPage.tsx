import { UseDashFunCoins } from "@/components/DashFun/DashFunCoins";
import { GameData } from "@/components/DashFunData/GameData";
import { Link } from "@/components/Link/Link";
import { CoinInfo, getCoinIcon } from "@/constats";
import dashfunIcon from "@/icons/dashfun-icon.svg";
import { Env, getEnv, TGLink } from "@/utils/DashFunApi";
import { useUtils } from "@telegram-apps/sdk-react";
import { Avatar, Button, Cell, Headline, List, Section } from "@telegram-apps/telegram-ui";
import { SectionFooter } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import { FC } from "react";
import { IntroPageGameSection } from "./IntroPageGame";

export const IntroPage: FC = () => {
	const utils = useUtils();
	const coins = UseDashFunCoins();

	const games: GameData[] = [];

	games.push(new GameData({
		id: "9c4r4sdzb40",
		name: "War Three Kingdoms",
		desc: "Easy and fast Idle RPG",
		iconUrl: "https://res.dashfun.games/icons/3kweb3-512.jpg",
		url: "",
		genre: [],
		time: 0,
		openTime: 0,
		logoUrl: "",
		mainPicUrl: "",
	}))

	if (getEnv() == Env.Dev) {
		//开发环境下增加LocalTest
		games.push(new GameData({
			id: "LocalTest",
			iconUrl: "https://res.dashfun.games/icons/3kweb3-512.jpg",
			name: "Local Test",
			desc: "Local Test",
			url: "",
			genre: [],
			time: 0,
			openTime: 0,
			logoUrl: "",
			mainPicUrl: "",
		}));
	}



	const gamesDom: JSX.Element[] = []

	games.forEach(g => {
		const coin = coins.findCoinByGameId(g.id)
		const dom = <IntroPageGameSection game={g} coin={coin as CoinInfo} />
		gamesDom.push(dom)
	})

	return <List>
		<div className="w-full flex flex-col justify-center items-center pt-5">
			<Avatar src={dashfunIcon} size={96}></Avatar>
			<Headline weight="1" className="pt-1">DashFun</Headline>
		</div>
		<SectionFooter>
			DashFun is an upcoming mini-game platform featuring a collection of exciting and fast-paced games designed for quick, fun sessions. Stay tuned for the launch and get ready to dive into endless entertainment!
		</SectionFooter>

		<Section header="Follow US">
			<Link to="" onClick={() => utils.openTelegramLink(TGLink.groupLink())}>
				<Cell>Join Our Telegram Group</Cell>
			</Link>
			<Link to={"https://x.com/dashfun_app"}>
				<Cell>Follow Us On X</Cell>
			</Link>
		</Section>

		<Section header="New Games">
		</Section>
		{gamesDom}
	</List>
}