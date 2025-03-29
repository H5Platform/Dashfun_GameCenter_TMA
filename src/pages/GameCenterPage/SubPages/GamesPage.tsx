import { GameListType } from "@/components/DashFunData/GameData";
import { GameIcon } from "@/components/GameIcon/GameIcon";
import { L, LangKeys } from "@/components/Language/Language";
import { isPcBrowser } from "@/utils/Utils";
import { Card, Input, Skeleton } from "@telegram-apps/telegram-ui";
import { CardCell } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import { useEffectOnActive } from "keepalive-for-react";
import { ChevronRight, Search, X } from "lucide-react";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCell from "../Components/GameCell";
import { useGameCenterData } from "../Components/GameCenterDataProvider";
import ProfileHeader from "../Components/ProfileHeader";
import { TGLink } from "@/utils/DashFunApi";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { DFText } from "@/components/controls";

export const GameCenter_GamesPage: FC = () => {
	return <div id="GameCenter_GamesPage" className="w-full p-4">
		<ProfileHeader />
		<div className="py-2"></div>
		<Header />
		<div className="w-full flex flex-col pt-4 gap-3 pb-8">
			<Banner />
			<PlayRecordBar />
			<GameList listType={GameListType.New} />
			<GameList listType={GameListType.Popular} />
			<GameList listType={GameListType.Suggest} />
		</div>
	</div>
}

const Header: FC = () => {
	const navigator = useNavigate();
	// const avatar = useDashFunAvatar();
	return <div className="flex flex-row items-center w-full gap-2">
		<div className="w-full">
			<Input id="inputSearchGame"
				placeholder="Search Games"
				before={<Search strokeWidth={2} absoluteStrokeWidth color="gray" />}
				after={<X color="gray" absoluteStrokeWidth strokeWidth={4} />}
				onFocus={() => {
					navigator("/game-center/search");
				}}
				width="100%"
				className="flex-1"
			/>
		</div>
		{/* <DFAvatar src={avatar as string} size={48} onClick={()=>{
			navigator("/game-center/profile");
		}} /> */}
	</div>
}

const Banner: FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [pageWidth, setPageWidth] = useState(window.innerWidth);
	const [cardWidth, setCardWidth] = useState(0);
	const [cardHeight, setCardHeight] = useState(0);

	const { gamelist, loading } = useGameCenterData();

	const bannerRef = useRef<HTMLDivElement>(null);
	const banners: JSX.Element[] = [
		// <div key={1} className="bg-gray-200" style={{ width: cardWidth, height: cardHeight }}></div>,
		// <div key={2} className="bg-red-200" style={{ width: cardWidth, height: cardHeight }}></div>,
		// <div key={3} className="bg-blue-200" style={{ width: cardWidth, height: cardHeight }}></div>,
		// <div key={4} className="bg-purple-200" style={{ width: cardWidth, height: cardHeight }}></div>
	];

	gamelist?.game_list[GameListType.Banner]?.forEach((gameId, index) => {
		const game = gamelist.getGame(gameId);
		banners.push(
			<Card type="ambient" key={index}
				onClick={() => {
					if (game?.id) {
						const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
						openTelegramLink(url);
					}
				}}
				style={{ width: cardWidth - 8, height: cardHeight - 4, backgroundColor: "transparent", border: "2px solid var(--tg-theme-button-color)" }}>
				<Fragment>
					<img
						src={game?.getLogoUrl()}
						style={{ height: cardHeight, width: "auto", objectFit: "cover" }}
					/>
					<CardCell readOnly>
						{game?.desc}
					</CardCell>
				</Fragment>
			</Card>
		);
	});

	useEffect(() => {
		const handleResize = () => {
			let w = window.innerWidth;
			if (w > 640) w = 640;
			w -= 32; // 16px padding
			let cardWidth = (w) / 2;
			let cardHeight = cardWidth * 1.2;
			setPageWidth(w);
			setCardWidth(cardWidth);
			setCardHeight(cardHeight);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (banners.length <= 2) {
				return;
			}
			setCurrentIndex((prevIndex) => (prevIndex + 1) % (banners.length - 1));
		}, 5000);

		return () => clearInterval(interval);
	}, [gamelist?.game_list[GameListType.Banner]?.length]);

	useEffect(() => {
		if (bannerRef.current) {
			bannerRef.current.scrollTo({
				left: pageWidth * 0.5 * currentIndex,
				behavior: 'smooth'
			});
		}
	}, [currentIndex]);

	const divHeight = cardHeight + (isPcBrowser() ? 12 : 0)

	return <Skeleton
		visible={loading}>
		<div className="w-full overflow-x-auto hide-scrollbar" ref={bannerRef} style={{ height: divHeight }}>
			<div className="grid grid-flow-col gap-2">
				{banners}
			</div>
		</div>
	</Skeleton>
}

const PlayRecordBar: FC = () => {
	const { gamelist, updateGameList, loading } = useGameCenterData();
	const [playedList, setPlayedList] = useState<string[]>(gamelist?.game_list[GameListType.Played] ?? []);

	useEffectOnActive(() => {
		console.log("PlayRecordBar useEffectOnActive")
		if (updateGameList) {
			updateGameList([GameListType.Played]).then(() => {
				setPlayedList(gamelist?.game_list[GameListType.Played] ?? []);
			});
		}
	}, [gamelist]);


	if (gamelist == null) {
		<Skeleton className=" h-[64px]" visible={loading}>
		</Skeleton>
	} else if (playedList.length == 0) {
		return null;
	} else {
		return <div className="w-full flex flex-col gap-2">
			<div className="flex flex-row w-full">
				<DFText size="2xl" weight="2"><L langKey={LangKeys.GameListType} index={GameListType.Played} /></DFText>
			</div>
			<Skeleton
				visible={loading}>
				<div className="w-full overflow-x-auto hide-scrollbar">
					<div>
						<div className="grid grid-flow-col-dense auto-cols-max gap-2 min-h-[68px] pb-2 px-1">
							{playedList.map((gameId) => {
								const game = gamelist.getGame(gameId);
								return <GameIcon key={gameId} game={game} size={64} onClick={() => {

								}}>
								</GameIcon>
							})}
						</div>
					</div>
				</div>
			</Skeleton>
		</div>
	}
}

const GameList: FC<{ listType: number, limit?: number, countPerColumn?: number }> = ({ listType, limit = 30, countPerColumn = 3 }) => {
	const { gamelist, loading } = useGameCenterData();
	const [pageWidth, setPageWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			let w = window.innerWidth;
			if (w > 640) w = 640;
			w -= 32; // 16px padding
			setPageWidth(w);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const gamelistDom = [];
	if (gamelist?.game_list[listType]) {
		for (let i = 0; i < limit && i < gamelist.game_list[listType].length; i += countPerColumn) {
			const itemsDom = [];
			for (let j = i; j < i + countPerColumn && j < gamelist.game_list[listType].length; j++) {
				const gameId = gamelist.game_list[listType][j];
				const game = gamelist.getGame(gameId);

				let width = pageWidth * 0.95;
				let pr = 0;

				const count = Math.min(limit, gamelist.game_list[listType].length);
				let m = Math.round(count / countPerColumn) * countPerColumn;
				if (count % countPerColumn == 0) {
					m -= 1;
				}
				if (j >= m) {
					width = pageWidth;
					pr = pageWidth * 0.05;
				}
				itemsDom.push(<div key={gameId} style={{ width: width, paddingRight: pr }}>
					<GameCell game={game} />
				</div>);
			}
			gamelistDom.push(<div id={"list-item-" + i} key={i} className="flex flex-col snap-start">
				{itemsDom}
			</div>);
		}
	}

	return <div className="w-full flex flex-col">
		<div className="flex flex-row w-full pt-2 pb-2">
			<DFText size="2xl" weight="2"><L langKey={LangKeys.GameListType} index={listType} /></DFText>
			<ChevronRight color="white" size={30} strokeWidth={3.5} />
		</div>
		<Skeleton
			visible={loading}
			className="min-h-16">
			<div className="w-full grid grid-flow-col overflow-x-auto hide-scrollbar snap-mandatory snap-x">
				{
					gamelistDom
				}
			</div>
		</Skeleton>
	</div>
}


/**
 * width用来计算文字部分的宽度
 */
// const GameListItem1: FC<{ game: GameData | undefined, width: number }> = ({ game, width }) => {
// 	const maxWidth = width - 64 - 70 - 16 - 16;
// 	return <div className="w-full relative py-2  flex flex-row justify-start items-center pr-4">
// 		<GameIcon game={game} size={64} onClick={() => { console.log("onclick") }} openGameOnClick={false} />
// 		<div className="flex flex-col px-2 flex-1 w-full">
// 			<Headline weight="3" className="truncate overflow-hidden whitespace-nowrap flex-shrink-0" style={{ maxWidth }}>{game?.name}</Headline>
// 			<Caption style={{ height: 38, maxWidth, color: "var(--tgui--hint_color)", overflow: "hidden", textOverflow: "ellipsis" }}>{game?.desc}</Caption>
// 		</div>
// 		<Button mode="bezeled" size="s" className=" w-[70px]" onClick={() => {
// 			const url = TGLink.gameLink(encodeURIComponent(game?.id ?? ""));
// 			openTelegramLink(url);
// 		}}>Play</Button>
// 	</div>
// }