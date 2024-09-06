import { useDashFunUser } from '@/components/DashFun/DashFunUser';
import { GameData } from '@/components/DashFunData/GameData';
import { GameLauncher } from '@/components/GameLauncher/GameLauncher';
import { TaskList } from '@/components/TaskList/TaskList';
import { TGLink, UserApi } from '@/utils/DashFunApi';
import { useInitData, useLaunchParams, useUtils } from '@telegram-apps/sdk-react';
import { Avatar, Button, Modal } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { useState, type FC } from 'react';
import Iframe from 'react-iframe';
import "./GameWrapper.css";

import dashfunIcon from "../../icons/dashfun-icon-s.png";

export const GameWrapper: FC = () => {
	const [play, setPlay] = useState(false);
	const [showLoading, setShowLoadig] = useState(true);
	const [showTask, setShowTask] = useState(false);
	const [game, setGame] = useState<GameData | null>(null);
	const util = useUtils();
	const initData = useInitData();
	const initDataRaw = useLaunchParams().initDataRaw;
	const user = useDashFunUser();

	// const dfUser = useDashFunUser();

	const onShare = () => {
		if (game != null) {
			util.shareURL(game.tgLink());
		}
	}

	const onBackToCenter = () => {
		util.openTelegramLink(TGLink.centerLink())
	}

	const openTaskUI = async () => {
		// if (game != null) {
		// 	const tasks = await TaskApi.getTaskList(initDataRaw as string, game.id);
		// 	console.log("tasks:", tasks)
		// }
		setShowTask(true);
	}

	return <div className="game-wrapper">
		<SectionHeader style={{
			paddingTop: "5px",
			paddingBottom: "5px",
		}}>
			<div className='game-title'>
				<Button before={<Avatar src={dashfunIcon} size={24} />}
					size="s" onClick={() => {
						openTaskUI()
					}} >
					{/* <div className='flex flex-row items-center '>
						<div>
							<Image src={dashfunIcon} className='bg-transparent' size={24} />
						</div>
						<div>
							1230
						</div>
					</div> */}
					1230
				</Button>
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
		<div className='game-div'>
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
			{showLoading && (<div className={`game-loading ${play ? ", game-loading-fadeout" : ""}`} >
				<Modal
					dismissible={false}
					open={play == false}
					style={{ backgroundColor: "transparent" }}
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
							<TaskList user={user} game={game} onTaskClicked={({ processed }) => {
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