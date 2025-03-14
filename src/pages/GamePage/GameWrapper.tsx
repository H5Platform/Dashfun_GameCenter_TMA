import { useDashFunUser } from '@/components/DashFun/DashFunUser';
import { GameData } from '@/components/DashFunData/GameData';
import { GameLauncher } from '@/components/GameLauncher/GameLauncher';
import { TaskApi, TGLink, UserApi } from '@/utils/DashFunApi';
import { backButton, openTelegramLink, shareURL, useLaunchParams, useSignal, viewport } from '@telegram-apps/sdk-react';
import { Badge, Button, LargeTitle, Modal, Tabbar } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { useEffect, useState, type FC } from 'react';
import Iframe from 'react-iframe';
import "./GameWrapper.css";

import { CoinPanel, Coins } from '@/components/Coins/coins';
import { useDashFunCoins } from '@/components/DashFun/DashFunCoins';
import { useDashFunSpinWheel } from '@/components/DashFun/DashFunSpinWheel';
import { SpinWheelConstants } from '@/components/DashFunData/SpinWheelData';
import { DashFunUser } from '@/components/DashFunData/UserData';
import { SpinWheelStatusChangedEvent, TaskStatusChangedEvent } from '@/components/Event/Events';
import { MessageListener } from '@/components/MessageListener/MessageListener';
import SpinWheel from '@/components/SpinWheel/SpinWheel';
import { TaskAndCoin } from '@/components/TaskAndCoin/TaskAndCoin';
import { CoinInfo, TaskStatus } from '@/constats';
import { Gamepad2, Gift, LoaderPinwheel, Send } from 'lucide-react';
import { DFProfileAvatar } from '@/components/Avatar/Avatar';
import DashFunRecharge from '@/components/DashFunRecharge/DashFunRecharge';
import { motion } from 'framer-motion';
import { ContentWrapper } from '../ContentWrapper';
import { L, LangKeys } from '@/components/Language/Language';
import { isInTelegram } from '@/utils/Utils';

export const GameWrapper: FC = () => {
	const [play, setPlay] = useState(false);
	const [showLoading, setShowLoadig] = useState(true);
	const [showTask, setShowTask] = useState(false);
	const [showRecharge, setShowRecharge] = useState(false);
	const [game, setGame] = useState<GameData | null>(null);
	const initDataRaw = useLaunchParams().initDataRaw;
	// const startParam = useLaunchParams().startParam;
	const user = useDashFunUser();
	// current game coin
	const [coin, setCoin] = useState<CoinInfo | null>(null);

	// const coins = UseDashFunCoins();
	const [spinWheel, _1, _2] = useDashFunSpinWheel();
	const [spinStatus, setSpinStatus] = useState(0);

	const [coins, userCoinData, updateCoins, getCoinInfo] = useDashFunCoins();

	const top = useSignal(viewport.safeAreaInsetTop);
	const bottom = useSignal(viewport.safeAreaInsetBottom);
	const contentTop = useSignal(viewport.contentSafeAreaInsetTop)
	const contentBottom = useSignal(viewport.contentSafeAreaInsetBottom)

	const pt = top + contentTop;
	const pb = bottom + contentBottom;

	const [taskCount, setTaskCount] = useState<{ [key: number]: number }>({})

	const getTaskCount = async () => {
		if (game != null) {
			const count = await TaskApi.getCount(initDataRaw as string, game.id)
			setTaskCount(count);
		}
	}


	const onShare = () => {
		if (game != null) {
			shareURL(game.tgLink());
		}
	}

	const onBackToCenter = () => {
		openTelegramLink(TGLink.centerLink())
		//util.openTelegramLink(TGLink.botLink())
	}

	const openTaskUI = async () => {
		setShowTask(true);
	}

	useEffect(() => {
		setSpinStatus(spinWheel?.status || 0);
	}, [spinWheel])

	const evtListener = (_taskId: string, _status: number) => {
		//任务状态变化，重新获取task count
		console.log("get task count....")
		getTaskCount();
	}

	const spinListener = (_spinId: string, status: number) => {
		setSpinStatus(status)
	}

	useEffect(() => {
		if (userCoinData != null) {
			if (game != null) {
				const info = getCoinInfo(game.id, "gameId");
				if (info != null) {
					setCoin(info);
				}
			}
		}
	}, [coins, userCoinData])


	useEffect(() => {
		getTaskCount();
		if (updateCoins)
			updateCoins([game?.id || ""])

		TaskStatusChangedEvent.addListener(evtListener);
		SpinWheelStatusChangedEvent.addListener(spinListener);
		return () => {
			TaskStatusChangedEvent.removeListener(evtListener);
			SpinWheelStatusChangedEvent.removeListener(spinListener);
		}
	}, [game]);

	useEffect(() => {
		if (showRecharge) {
			backButton.show();
			return backButton.onClick(() => {
				setShowRecharge(false);
			});
		} else {
			backButton.hide();
		}
	}, [showRecharge])


	// const numb = coin?.userData?.amount || 0;
	// const formatted = numb == null ? "0" : numb.toLocaleString('en-US', { style: "decimal" })

	const tc = taskCount == null || taskCount[TaskStatus.Completed] == null ? 0 : taskCount[TaskStatus.Completed]
	const tp = taskCount == null || taskCount[TaskStatus.InProgress] == null ? 0 : taskCount[TaskStatus.InProgress]

	const diamond = getCoinInfo("DashFunDiamond", "name");

	const tabs = [
		{
			id: "tasks",
			text: "Tasks",
			Icon: () => <div>
				<div className=' relative w-[24px] h-[1px]'>
					<div className=' absolute left-[12px] top-[-5px]'>
						{
							tc > 0 && <Badge type='number'>{tc}</Badge>
						}
						{
							tc == 0 && tp > 0 && <Badge type='number' className=' bg-gray-500' >{tp}</Badge>
						}
					</div>
				</div>
				<Gift absoluteStrokeWidth className='my-1' />
			</div>,
			component: <TaskAndCoin user={user as DashFunUser} game={game} onTaskClicked={({ processed }) => {
				if (processed) {
					//关掉list，让用户重新开启以便刷新状态
					setShowTask(false);
				}
			}} />
		},
		{
			id: "spin",
			text: "Spin",
			Icon: () => <div>
				<div className=' relative w-[24px] h-[1px]'>
					<div className=' absolute left-[12px] top-[-5px]'>
						{
							spinStatus == SpinWheelConstants.Status.CanClaim && <Badge type='number'>{1}</Badge>
						}
						{
							spinStatus == SpinWheelConstants.Status.Spin && <Badge type='number' className=' bg-gray-500' >{1}</Badge>
						}
					</div>
				</div><LoaderPinwheel strokeWidth={2} absoluteStrokeWidth className='my-1' />
			</div>,
			component: <>
				<Coins game={game} user={user as DashFunUser} onSelected={c => {
					console.log("ccc", c);
				}} />
				<div className="w-full flex justify-center items-center">
					<LargeTitle weight="3">
						Spin & Win Daily
					</LargeTitle>
				</div>
				<SpinWheel user={user as DashFunUser} game={game} />
			</>

		},
	];


	const [currentTab, setCurrentTab] = useState(tabs[0].id);

	const avatarWidth = window.innerWidth > 400 ? 40 : 32;

	const header = <SectionHeader
		className='px-2'
		style={{
			paddingTop: "5px",
			paddingBottom: "5px",
		}}>
		<MessageListener />
		<div className='game-title max-w-screen-sm sm:mx-auto flex items-center gap-2'>
			<DFProfileAvatar size={avatarWidth} onClick={() => {
				openTaskUI();
				getTaskCount();
			}}>
				{
					tc > 0 && (<div className=''>
						<Badge type='number'>{tc}</Badge>
					</div>)
				}
				{
					tc == 0 && tp > 0 && (<div className=''>
						<Badge type='number' className=' bg-gray-500' >{tp}</Badge>
					</div>)
				}
			</DFProfileAvatar>

			<div className='w-56 gap-2 flex items-center justify-between'>
				<div className='w-24'>
					<CoinPanel coin={coin?.coin} userCoinData={coin?.userData} />
				</div>
				<div className='flex-1'>
					<CoinPanel coin={diamond?.coin} userCoinData={diamond?.userData} showAdd onClick={() => {
						setShowRecharge(true);
					}} />
				</div>
			</div>
			{/* <Button mode="white"
				before={<Avatar src={getCoinIcon1(coin?.coin ?? null)} size={24} > </Avatar>}
				size="s" onClick={() => {
					openTaskUI();
					getTaskCount();
				}} >
				<Text className='text-black'>{formatted}</Text>

			</Button> */}
			{/* <div className='flex-1 relative'>
				{
					tc > 0 && (<div className=' absolute top-0 left-[-15px]'>
						<Badge type='number'>{tc}</Badge>
					</div>)
				}
				{
					tc == 0 && tp > 0 && (<div className=' absolute top-0 left-[-15px]'>
						<Badge type='number' className=' bg-gray-500' >{tp}</Badge>
					</div>)
				}
			</div> */}
			<div className='flex gap-1 items-end flex-1 justify-end'>
				<Button size="s" mode="filled" onClick={() => {
					onBackToCenter();
				}} ><Gamepad2 size="24" strokeWidth={2} absoluteStrokeWidth /> </Button>
				<Button size="s" mode="white" style={{ color: "#000000" }} onClick={() => {
					onShare();
				}}><Send size="20" strokeWidth={1.5} absoluteStrokeWidth /></Button>
			</div>
		</div>
	</SectionHeader >

	return <div id="game-wrapper" className="game-wrapper max-w-screen-sm sm:mx-auto" style={{ paddingTop: pt, paddingBottom: pb }}>
		{header}
		<div id="game-iframe" className=' flex-1 h-full'>
			<Iframe
				id='GameFrame'
				name='GameFrame'
				url={game == null ? "" : game.url}
				display="block"
				width='100%'
				height="100%"
				frameBorder={0}
				className='game-frame'
				styles={{
					visibility: play ? "" : "hidden"
				}}
			/>
			{showLoading && (<div className={`flex justify-center items-start game-loading ${play ? ", game-loading-fadeout" : ""}`} >
				{/* <div className='h-[200px] mt-[100px] bg-cover bg-center bg-no-repeat ' style={{
					backgroundImage: `url('${game?.logoUrl}')`
				}}></div> */}
				<img src={game?.getLogoUrl()} className=' object-contain max-w-screen-sm mx-auto' style={{ width: "90vw", paddingTop: (pt + 100) + "px" }} ></img>
				<Modal
					className='max-w-screen-sm sm:mx-auto'
					dismissible={false}
					open={play == false}
					style={{ backgroundColor: "transparent" }}
					overlayComponent={
						<div className=' bg-[#21212130] pointer-events-auto fixed left-0 right-0 z-[var(--tgui--z-index--overlay)]' style={{ top: pt + "px", bottom: pb + "px" }}>
							{header}
						</div>
					}
				>

					<GameLauncher gameId={undefined}
						footer={null}
						onLoad={g => {
							setGame(g as GameData);
						}}
						onPlayClicked={() => {
							//上报enterGame
							if (game != null) {
								console.log("report user enter game:", game)
								UserApi.enterGame(initDataRaw as string, game.id)
								setPlay(true);
								setTimeout(() => {
									setShowLoadig(false);
								}, 2000);
							}
						}} />

				</Modal>

			</div>)
			}
			{
				showTask && (
					<Modal
						className='max-w-screen-sm sm:mx-auto'
						open={showTask}
						header={<ModalHeader style={{
							backgroundColor: "var(--tg-theme-secondary-bg-color)"
						}}></ModalHeader>
							// <div className='flex flex-col bg-gray-200 text-black p-2 w-full items-center justify-center gap-1'>
							// 	<div className=' w-10 h-1 bg-gray-400 rounded-full mb-2'></div>
							// 	<Text weight='1'>Tasks</Text>
							// </div>
						}
						onOpenChange={e => {
							if (e == false) {
								setShowTask(false);
							}
						}}
						snapPoints={[0.9]}
					>
						<div className='flex flex-col w-full h-full' style={{
							backgroundColor: "var(--tg-theme-secondary-bg-color)"
						}}>
							<div style={{ paddingBottom: "calc(10vh + 100px) " }}>
								{tabs.find((t) => t.id == currentTab)?.component}
							</div>

							<Tabbar id="bottomNavigation" style={{ bottom: "10vh" }}>
								{tabs.map(({ id, text, Icon }) => (
									<Tabbar.Item
										key={id}
										text={text}
										selected={id === currentTab}
										onClick={() => setCurrentTab(id)}
										style={{ paddingBottom: bottom + "px" }}
									>
										<Icon />
									</Tabbar.Item>
								))}
							</Tabbar>
						</div>
					</Modal>
				)
			}
			{
				showRecharge && (
					<div id="recharge-overlay" className='pointer-events-auto absolute top-0 bottom-0 left-0 right-0 z-[9999]'>
						<ContentWrapper className='h-full max-w-screen-md md:mx-auto'>
							<motion.div
								className='w-full h-full'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<div className='flex flex-col w-full h-full max-h-full min-h-0 ' style={{
									backgroundColor: "var(--tg-theme-secondary-bg-color)",
									//paddingBottom: "calc(10vh) "
								}}>
									{!isInTelegram() &&
										<div className='p-4'>
											<Button mode="plain" onClick={() => { setShowRecharge(false) }}>
												<L langKey={LangKeys.Common_Close} />
											</Button>
										</div>
									}
									<div className='w-full min-h-0 flex-1'>
										<DashFunRecharge />
									</div>
								</div>
							</motion.div>
						</ContentWrapper>
					</div>
				)
			}
		</div >
	</div >
}	