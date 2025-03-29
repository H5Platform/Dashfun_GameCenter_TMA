import { GameListType } from "@/components/DashFunData/GameData";
import { GameIcon } from "@/components/GameIcon/GameIcon";
import { L, LangKeys, useLanguage } from "@/components/Language/Language";
import { useEffectOnActive } from "keepalive-for-react";
import { Heart } from "lucide-react";
import { FC, PropsWithChildren, ReactNode, useCallback, useEffect, useState } from "react";
import { useGameCenterData } from "../Components/GameCenterDataProvider";
import ProfileHeader from "../Components/ProfileHeader";
import { DFText } from "@/components/controls";

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
	return <div className="relative w-full rounded-xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#1E6493] to-[#0C3D63]">
		<div className="absolute inset-0 rounded-xl ring-1 ring-blue-400/50 pointer-events-none z-0"></div>
		<div className="flex flex-row items-center pb-2">
			{icon && <div className="mr-2">{icon}</div>}
			<DFText size="xl" weight="2">{header}</DFText>
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
					<DFText weight="1" size="m" color="#cccccc">
						<L langKey={LangKeys.ProfileNoRecentGame} />
					</DFText> :
					<div className="w-full overflow-x-auto hide-scrollbar">
						<div>
							<div className="grid grid-flow-col-dense auto-cols-max gap-4 min-h-[64px]">
								{recentList.map((gameId) => {
									const game = gamelist?.getGame(gameId);
									return <div className="flex flex-col justify-center items-center" style={{ width: 64 }} key={gameId}>
										<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }}></GameIcon>
										<DFText weight="1" size="xs" className="w-full pt-2 truncate overflow-hidden min-w-0 text-center">
											{game?.name}
										</DFText>
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
					<DFText weight="1" color="#cccccc" size="m">
						<L langKey={LangKeys.ProfileNoFavoritesGame} />
					</DFText> :
					<div className="w-full overflow-x-auto hide-scrollbar">
						<div>
							<div className="grid grid-flow-col-dense auto-cols-max gap-2 min-h-[64px]">
								{favoritesList.reverse().map((gameId) => {
									const game = gamelist?.getGame(gameId);
									return <div className="flex flex-col justify-center items-center" style={{ width: 64 }} key={gameId}>
										<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }}></GameIcon>
										<DFText weight="1" size="xs" className="w-full pt-2 truncate overflow-hidden min-w-0 text-center">
											{game?.name}
										</DFText>
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