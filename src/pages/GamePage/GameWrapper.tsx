import { GameData } from '@/components/DashFunData/GameData';
import { GameLauncher } from '@/components/GameLauncher/GameLauncher';
import { useInitData, useUtils } from '@telegram-apps/sdk-react';
import { Button, Modal } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { useState, type FC } from 'react';
import Iframe from 'react-iframe';
import "./GameWrapper.css";
import { useDashFunUser } from '@/components/DashFun/DashFunUser';
export const GameWrapper: FC = () => {

	const [play, setPlay] = useState(false);
	const [showLoading, setShowLoadig] = useState(true);
	const [game, setGame] = useState<GameData | null>(null);
	const util = useUtils();
	const initData = useInitData();
	const dfUser = useDashFunUser();

	const onShare = () => {
		if (game != null) {
			util.shareURL(game.tgLink());
		}
	}

	return <div className="game-wrapper">
		<SectionHeader style={{
			paddingTop: "5px",
			paddingBottom: "5px",
		}}>
			<div className='game-title'>

				<Button size="s" mode="white" style={{ color: "#000000" }}><i className="fa-brands fa-bitcoin" style={{ color: "#ff8000" }}></i> 12345</Button>
				<div style={{ display: 'flex', gap: 10 }}>
					<Button size="s" mode="filled" >&nbsp;<i className="fa-solid fa-gamepad">&nbsp;</i></Button>
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
							setPlay(true);
							setTimeout(() => {
								setShowLoadig(false);
							}, 2000);
						}} />
				</Modal>
			</div>)}
		</div>
	</div >
}