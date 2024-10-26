import { useDashFunUser } from '@/components/DashFun/DashFunUser';
import { GameData } from '@/components/DashFunData/GameData';
import { GameLauncher } from '@/components/GameLauncher/GameLauncher';
import { TaskApi, TGLink, UserApi } from '@/utils/DashFunApi';
import { useInitData, useLaunchParams, useUtils } from '@telegram-apps/sdk-react';
import { Avatar, Badge, Button, Modal, Text } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { useEffect, useState, type FC } from 'react';
import Iframe from 'react-iframe';
import "./GameWrapper.css";

import { UseDashFunCoins } from '@/components/DashFun/DashFunCoins';
import { TaskAndCoin } from '@/components/TaskAndCoin/TaskAndCoin';
import { getCoinIcon, TaskStatus } from '@/constats';
import { TaskStatusChangedEvent } from '@/components/Event/Events';

export const GameWrapper: FC = () => {
	const [play, setPlay] = useState(false);
	const [showLoading, setShowLoadig] = useState(true);
	const [showTask, setShowTask] = useState(false);
	const [game, setGame] = useState<GameData | null>(null);
	const util = useUtils();
	const initData = useInitData();
	const initDataRaw = useLaunchParams().initDataRaw;
	const user = useDashFunUser();
	const coins = UseDashFunCoins();

	const [taskCount, setTaskCount] = useState<{ [key: number]: number }>({})


	const getTaskCount = async () => {
		if (game != null) {
			const count = await TaskApi.getCount(initDataRaw as string, game.id)
			setTaskCount(count);
		}
	}


	const onShare = () => {
		if (game != null) {
			util.shareURL(game.tgLink());
		}
	}

	const onBackToCenter = () => {
		util.openTelegramLink(TGLink.centerLink())
		//util.openTelegramLink(TGLink.botLink())
	}

	const openTaskUI = async () => {
		setShowTask(true);
	}

	useEffect(() => {
		getTaskCount();
	}, [game])

	const evtListener = (_taskId: string, _status: number) => {
		//任务状态变化，重新获取task count
		console.log("get task count....")
		getTaskCount();
	}

	useEffect(() => {
		TaskStatusChangedEvent.addListener(evtListener)
		return () => { TaskStatusChangedEvent.removeListener(evtListener) }
	}, [game]);

	const numb = coins == null ? 0 : coins.findCoinByName("DashFunPoint")?.userData.amount
	const formatted = numb == null ? "0" : numb.toLocaleString('en-US', { style: "decimal" })

	const tc = taskCount == null || taskCount[TaskStatus.Completed] == null ? 0 : taskCount[TaskStatus.Completed]
	const tp = taskCount == null || taskCount[TaskStatus.InProgress] == null ? 0 : taskCount[TaskStatus.InProgress]

	const header = <SectionHeader style={{
		paddingTop: "5px",
		paddingBottom: "5px",
	}}>
		<div className='game-title'>
			<Button mode="white"
				before={<Avatar src={getCoinIcon("DashFunPoint")} size={24} > </Avatar>}
				size="s" onClick={() => {
					openTaskUI();
					getTaskCount();
				}} >
				<Text className='text-black'>{formatted}</Text>

			</Button>
			<div className='flex-1 relative'>
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
			</div>
			<div className='flex gap-1'>
				<Button size="s" mode="filled" >&nbsp;<i className="fa-solid fa-gamepad" onClick={() => {
					onBackToCenter();
				}}>&nbsp;</i></Button>
				<Button size="s" mode="white" style={{ color: "#000000" }} onClick={() => {
					onShare();
				}}>&nbsp;<i className="fa-solid fa-paper-plane"></i>&nbsp;</Button>
			</div>
		</div>
	</SectionHeader >

	return <div className="game-wrapper">
		{header}
		<div className=' flex-1 h-full'>
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
				<img src={game?.logoUrl} className=' object-contain pt-[100px]' style={{ width: "90vw" }} ></img>
				<Modal
					dismissible={false}
					open={play == false}
					style={{ backgroundColor: "transparent" }}
					overlayComponent={
						<div className=' bg-[#21212164] pointer-events-auto fixed left-0 top-0 right-0 bottom-0 z-[var(--tgui--z-index--overlay)]'>
							{header}
						</div>
					}
				>

					<GameLauncher gameId={initData?.startParam}
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

			</div>)}

			{showTask && (
				<Modal
					open={showTask}
					header={<ModalHeader style={{
						backgroundColor: "var(--tg-theme-secondary-bg-color)"
					}}>Tasks</ModalHeader>
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
					snapPoints={[1]}
				>
					<div className='flex flex-col w-full h-full' style={{
						backgroundColor: "var(--tg-theme-secondary-bg-color)"
					}}>
						<div className="pb-4">
							<TaskAndCoin user={user} game={game} onTaskClicked={({ processed }) => {
								if (processed) {
									//关掉list，让用户重新开启以便刷新状态
									setShowTask(false);
								}
							}} />
						</div>
					</div>
				</Modal>
			)}
		</div>
	</div >
}