import { GameListType } from "@/components/DashFunData/GameData";
import { GameIcon } from "@/components/GameIcon/GameIcon";
import { L, LangKeys, useLanguage } from "@/components/Language/Language";
import { Caption, Headline, Text } from "@telegram-apps/telegram-ui";
import { useEffectOnActive } from "keepalive-for-react";
import { Heart } from "lucide-react";
import { FC, PropsWithChildren, ReactNode, useCallback, useEffect, useState } from "react";
import { useGameCenterData } from "../Components/GameCenterDataProvider";
import ProfileHeader from "../Components/ProfileHeader";

export const GameCenter_Profile: FC = () => {
	// const tabItems = [
	// 	{
	// 		icon: <UsersRound size={20} />,
	// 		name: get(LangKeys.ProfileMyFriends),
	// 		item: <MyFriends />
	// 	},
	// 	{
	// 		icon: <Gamepad2 />,
	// 		name: get(LangKeys.ProfileMyGames),
	// 		item: <MyGames />
	// 	}
	// ]

	return <div id="GameCenter_Profile" className="w-full flex flex-col gap-4 p-4">
		<ProfileHeader disableClick />
		{/* <div className="w-full flex flex-row gap-4">
			{
				tabItems.map((item, index) => {
					return <Button key={index}
						mode={index == tabselected ? "filled" : "outline"} size="s" className="flex-1"
						before={item.icon}
						onClick={() => { setTabSelected(index) }}>
						{item.name}
					</Button>
				})
			}
		</div>
		{tabItems[tabselected].item} */}
		<MyGames />
	</div >
}

// const TopBar: FC<{ avatar: string, user: DashFunUser | null | undefined }> = ({ avatar, user }) => {
// 	return <div className="w-full flex flex-row">
// 		<DFAvatar size={64} src={avatar} />
// 		<div className="flex flex-1 flex-col pl-4 justify-center">
// 			<Headline weight="2">{user?.displayName}</Headline>
// 			<Text weight="3" style={{ color: "var(--tgui--hint_color)" }}> {user?.userName ? "@" + user?.userName : ""}</Text>
// 		</div>
// 	</div>
// }

const Section: FC<PropsWithChildren<{ header: string, icon?: ReactNode }>> = ({ header, icon, children }) => {
	return <div className="w-full flex flex-col p-3 rounded-2xl" style={{ backgroundColor: "var(--tg-theme-section-bg-color)" }}>
		<div className="flex flex-row items-center pb-2">
			{icon && <div className="mr-2">{icon}</div>}
			<Headline weight="2">{header}</Headline>
		</div>
		{children}
	</div>
}

const MyGames: FC = () => {
	const { gamelist, updateGameList, loading } = useGameCenterData();
	const [get] = useLanguage();
	const [recentList, setRecentList] = useState<string[]>([]);
	const [favoritesList, setFavoritesList] = useState<string[]>([]);

	const updateList = useCallback(() => {
		const recentList = gamelist?.game_list[GameListType.Played] ?? [];
		const favoritesList = gamelist?.game_list[GameListType.Favorites] ?? [];
		setRecentList(recentList);
		setFavoritesList(favoritesList);
	}, [gamelist])

	useEffectOnActive(() => {
		if (updateGameList) {
			updateGameList([GameListType.Played, GameListType.Favorites]).then(() => {
				updateList();
			})
		}
	}, [])

	useEffect(() => {
		updateList();
	}, [gamelist])

	return <div className="w-full flex flex-col gap-4">
		<Section
			header={get(LangKeys.ProfileRecentGames) as string}
		>
			{
				!loading && (recentList.length == 0 ?
					<Text weight="3" style={{ color: "var(--tgui--hint_color)", height: 64 }}>
						<L langKey={LangKeys.ProfileNoRecentGame} />
					</Text> :
					<div className="w-full overflow-x-auto hide-scrollbar">
						<div>
							<div className="grid grid-flow-col-dense auto-cols-max gap-4 min-h-[64px]">
								{recentList.map((gameId) => {
									const game = gamelist?.getGame(gameId);
									return <div className="flex flex-col justify-center items-center" style={{ width: 64 }} key={gameId}>
										<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }}></GameIcon>
										<Caption className="w-full pt-1 truncate overflow-hidden whitespace-nowrap flex-shrink-0 text-center">
											{game?.name}
										</Caption>
									</div>
								})}
							</div>
						</div>
					</div>)
			}
		</Section>

		<Section
			header={get(LangKeys.ProfileFavoritesGames) as string}
			icon={<Heart stroke="0" fill="#ef4444" />}
		>
			{
				!loading && (favoritesList.length == 0 ?
					<Text weight="3" style={{ color: "var(--tgui--hint_color)", height: 64 }}>
						<L langKey={LangKeys.ProfileNoFavoritesGame} />
					</Text> :
					<div className="w-full overflow-x-auto hide-scrollbar">
						<div>
							<div className="grid grid-flow-col-dense auto-cols-max gap-2 min-h-[64px]">
								{favoritesList.reverse().map((gameId) => {
									const game = gamelist?.getGame(gameId);
									return <div className="flex flex-col justify-center items-center" style={{ width: 64 }} key={gameId}>
										<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }}></GameIcon>
										<Caption className="w-full pt-1 truncate overflow-hidden whitespace-nowrap flex-shrink-0 text-center">
											{game?.name}
										</Caption>
									</div>
								})}
							</div>
						</div>
					</div>)
			}
		</Section>
	</div>
}

// const MyFriends: FC = () => {
// 	return <div>My Friends</div>
// }