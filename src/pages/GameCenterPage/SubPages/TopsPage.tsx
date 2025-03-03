import { LeaderBoardApi } from "@/utils/DashFunApi"
import { initData, useSignal } from "@telegram-apps/sdk-react"
import { Cell, Title } from "@telegram-apps/telegram-ui"
import { useEffectOnActive } from "keepalive-for-react"
import { FC, useState } from "react"
import ProfileHeader from "../Components/ProfileHeader"
import Section from "@/components/Section/Section"
import xpIcon from "@/icons/dashfun-xp-icon.png"
import { toCurrency } from "@/constats"
import { DFUserAvatar } from "@/components/Avatar/Avatar"

type TopListItem = {
	id: string,
	rank: number,
	score: number,
	username: string,
	display_name: string,
	avatar: string,
}

export const GameCenter_TopPage: FC = () => {
	const initDataRaw = useSignal(initData.raw)
	const [_loading, setLoading] = useState(false);
	const [xpTopList, setXpTopList] = useState<TopListItem[]>([]);

	const getXpTop = async () => {
		setLoading(true);
		try {
			const result = await LeaderBoardApi.xpTop(initDataRaw as string);
			setXpTopList(result);
		} finally {
			setLoading(false);
		}
	}

	useEffectOnActive(() => {
		getXpTop();
	}, [])

	const myRank = xpTopList.length > 0 ? xpTopList[xpTopList.length - 1] : null;

	return <div id="GameCenter_TopPage" className="w-full h-full flex flex-col px-4 pt-4 items-center gap-2">
		<ProfileHeader />
		<Title weight="2" className="py-4 w-full text-center">XP Leaderboard</Title>
		<LeaderboardList list={xpTopList.slice(0, -1)} />
		{myRank && <LeaderboardItem item={myRank} />}
	</div>
}

const LeaderboardList: FC<{ list: TopListItem[] }> = ({ list }) => {
	return <div className="w-full flex flex-col gap-2 h-full overflow-y-auto">
		<Section >
			{
				list.map((item, i) => {
					return <LeaderboardItem key={i} item={item} />
				})
			}
		</Section>
	</div>
}

const LeaderboardItem: FC<{ item: TopListItem }> = ({ item }) => {
	return <Cell className="w-full"
		after={<div className="flex flex-row items-center gap-1">
			<div className="w-16 text-right">{toCurrency(item.score)}</div>
			<img src={xpIcon} className="w-5 h-5" />
		</div>}
	>
		<div className="w-full flex flex-row items-center">
			<div className="w-8">{item.score == 0 ? "" : item.rank}</div>
			<DFUserAvatar size={32} userId={item.id} avatarPath={item.avatar} displayName={item.display_name} />
			<div className="min-w-0 truncate pl-2">{item.display_name}</div>
		</div>
	</Cell>
}