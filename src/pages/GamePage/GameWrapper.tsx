import { GameData } from '@/components/DashFunData/GameData';
import { GameLauncher } from '@/components/GameLauncher/GameLauncher';
import { useInitData, useLaunchParams, useUtils } from '@telegram-apps/sdk-react';
import { Button, Modal } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { useState, type FC } from 'react';
import Iframe from 'react-iframe';
import "./GameWrapper.css";
import { TGLink, UserApi } from '@/utils/DashFunApi';
export const GameWrapper: FC = () => {

	const [play, setPlay] = useState(false);
	const [showLoading, setShowLoadig] = useState(true);
	const [game, setGame] = useState<GameData | null>(null);
	const util = useUtils();
	const initData = useInitData();
	const initDataRaw = useLaunchParams().initDataRaw;

	// const dfUser = useDashFunUser();

	const onShare = () => {
		if (game != null) {
			util.shareURL(game.tgLink());
		}
	}

	const onBackToCenter = () => {
		util.openTelegramLink(TGLink.centerLink())
	}

	return <div className="game-wrapper">
		<SectionHeader style={{
			paddingTop: "5px",
			paddingBottom: "5px",
		}}>
			<div className='game-title'>

				<Button size="s" mode="white" style={{ color: "#000000" }}><i className="fa-brands fa-bitcoin" style={{ color: "#ff8000" }}></i> 0</Button>
				<div style={{ display: 'flex', gap: 10 }}>
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
		</div>
	</div >
}