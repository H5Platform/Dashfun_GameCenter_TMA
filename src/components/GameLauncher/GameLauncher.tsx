import { FC, useEffect, useState } from "react";

import { useUtils } from "@telegram-apps/sdk-react";
import { Button, Image, Spinner } from "@telegram-apps/telegram-ui";
import { useDashFunGame } from "../DashFun/DashFunGame";
import { GameData } from "../DashFunData/GameData";
import { GameLoadingEvent } from "../Event/Events";
import "./GameLauncher.css";
import { toTimeString } from "@/utils/Utils";

export type GLProps = JSX.IntrinsicElements['div'] & {
	gameId: string | undefined,
	onLoad: (game: GameData) => void,
	onPlayClicked: () => void,
	footer: JSX.Element | null
};

export const GameLauncher: FC<GLProps> = ({ gameId, onLoad, onPlayClicked, footer }) => {

	//const initDataRaw = useLaunchParams().initDataRaw;
	//const [game, setGame] = useState<GameData | null>(null);
	const game = useDashFunGame();
	const [loading, setLoading] = useState(-1);
	const utils = useUtils();
	const [playText, setPlayText] = useState("Play")

	// const loadGame = async (gameId: string | undefined): Promise<GameData | undefined> => {
	// 	if (gameId == null) {
	// 		return undefined;
	// 	}

	// 	const game = await GameApi.findGame(gameId, initDataRaw as string)
	// 	if (game != null) {
	// 		setGame(game);
	// 		onLoad(game);
	// 	}
	// }

	useEffect(() => {
		// loadGame(gameId);
		onLoad(game as GameData);
		const onLoading = (value: number) => {
			console.log("loading....", value)
			setLoading(value);
		}

		GameLoadingEvent.addListener(onLoading);
		return () => { GameLoadingEvent.removeListener(onLoading); }
	}, [gameId, game])

	const openTime = game?.openTime || 0;
	const now = Date.now()
	if (openTime > now) {
		setTimeout(() => {
			const t = (openTime - now) / 1000;
			const d = Math.floor(t / 86400);
			const h = Math.floor((t % 86400) / 3600);
			const m = Math.floor((t % 3600) / 60);
			const s = Math.floor(t % 60);

			setPlayText(toTimeString(d, h, m, s))
		}, 1000)
	} else {
		if (playText != "Play") {
			setPlayText("Play")
		}
	}

	return <div className="gl-container">
		<div className="gl-gamepanel">
			{game == null ? <div className="gl-loading-spinner"><Spinner size="l" /> </div> :
				<>
					<div className="gl-gametitle-div">
						<div className="gl-gameicon">
							<Image src={game.getIconUrl()} size={96}></Image>
						</div>
						<span className="gl-game-name">{game?.name}</span>
					</div>
					<div className="gl-game-desc">
						{game?.desc}
					</div>
					<div className="gl-gamebutton-div">
						<Button
							mode="bezeled"
							size="m"
							stretched
							onClick={() => {
								if (game != null) {
									utils.shareURL(game.tgLink());
								}
							}}
						>
							<i className="fa-solid fa-paper-plane" style={{ marginRight: "10px" }}></i>Share game
						</Button>
						<Button
							mode="bezeled"
							size="m"
							onClick={() => {
								// window.postMessage({
								// 	dashfun: {
								// 		method: "getUserProfile"
								// 	}
								// }, "*");

								// const eventListener = (ev: MessageEvent<any>) => {
								// 	const { data } = ev;
								// 	if (data.dashfun) {
								// 		const { method, result } = data.dashfun;
								// 		if (method == "requestPaymentResult" && result.state == "success") {
								// 			const { invoiceLink, paymentId } = result.data;
								// 			console.log(invoiceLink, paymentId)
								// 			window.removeEventListener('message', eventListener)
								// 			window.postMessage({
								// 				dashfun: {
								// 					method: "openInvoice",
								// 					value: invoiceLink
								// 				}
								// 			})
								// 		}
								// 	}
								// }

								// window.addEventListener('message', eventListener)
								// window.postMessage({
								// 	dashfun: {
								// 		method: "requestPayment",
								// 		gameId,
								// 		title: "Test Item",
								// 		desc: "for payment test",
								// 		payload: "dashfun payload",
								// 		price: 1
								// 	}
								// }, "*")
							}}
						>
							<i className="fa-regular fa-heart"></i>&nbsp;
						</Button>
					</div>
				</>}
		</div>
		<div className="gl-playbutton">
			<Button size="m" stretched disabled={loading == -1} loading={loading >= 0 && loading < 100} onClick={_ => {
				if (openTime > now) {
					return;
				}
				if (loading >= 100) {
					onPlayClicked?.call([]);
				}
			}}>{playText}</Button>
		</div>
		{footer}
	</div>
}