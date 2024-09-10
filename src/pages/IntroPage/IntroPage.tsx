import { Link } from "@/components/Link/Link";
import dashfunIcon from "@/icons/dashfun-icon.svg";
import { Avatar, Cell, Headline, List, Section } from "@telegram-apps/telegram-ui";
import { SectionFooter } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import { FC } from "react";

export const IntroPage: FC = () => {

	return <List>
		<div className="w-full flex flex-col justify-center items-center pt-5">
			<Avatar src={dashfunIcon} size={96}></Avatar>
			<Headline weight="1" className="pt-1">DashFun</Headline>
		</div>
		<SectionFooter>
			DashFun is an upcoming mini-game platform featuring a collection of exciting and fast-paced games designed for quick, fun sessions. Stay tuned for the launch and get ready to dive into endless entertainment!
		</SectionFooter>

		<Section header="Follow US">
			<Link to={"https://t.me/+h79TJSlUaO03ZDdh"}>
				<Cell>Join Our Telegram Group</Cell>
			</Link>
			<Link to={"https://x.com/DashFun_Web3"}>
				<Cell>Follow Us On X</Cell>
			</Link>
		</Section>
	</List>
}