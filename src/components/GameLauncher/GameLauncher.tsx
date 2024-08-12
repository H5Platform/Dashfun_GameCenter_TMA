import { FC, useEffect, useState } from "react";

import { GameApi } from "@/utils/DashFunApi";
import { InvoiceState, useInvoice, useLaunchParams, useUtils } from "@telegram-apps/sdk-react";
import { Button, Spinner } from "@telegram-apps/telegram-ui";
import { GameData } from "../DashFunData/GameData";
import "./GameLauncher.css";

export type GLProps = JSX.IntrinsicElements['div'] & {
	gameId: string | undefined,
	onLoad: (game: GameData) => void
	onPlayClicked: () => void;
};

export const GameLauncher: FC<GLProps> = ({ gameId, onLoad, onPlayClicked }) => {

	const initDataRaw = useLaunchParams().initDataRaw;
	const [game, setGame] = useState<GameData | null>(null);
	const utils = useUtils();
	const invoice = useInvoice();
	invoice.on("change", (state: InvoiceState) => {
		console.log("cccccc", state)
	})

	const loadGame = async (gameId: string | undefined): Promise<GameData | undefined> => {
		if (gameId == null) {
			return undefined;
		}
		const game = await GameApi.findGame(gameId, initDataRaw as string)
		if (game != null) {
			setGame(game);
			console.log("get game:", game)
			onLoad(game);
		}
	}

	useEffect(() => {
		loadGame(gameId);
		// const g: Game = {
		// 	id: gameId as string,
		// 	name: "Test Game",
		// 	desc: "game description....game description....game description....game description....game description....",
		// 	//url: "http://10.0.0.173:7456/web-mobile/web-mobile/index.html",
		// 	url: "https://stone-res.83you.com/StoneAge_20230413/game.html",
		// 	tgLink: "https://t.me/DashFunBot/Games?startapp=" + gameId
		// };

		// //模拟读取数据
		// setTimeout(() => {
		// 	setGame(g);
		// 	onLoad(g);
		// }, 1000);
		// if (gameId != null) {
		// 	GameApi.findGame(gameId, initDataRaw as string)
		// }
	}, [gameId])

	return <div className="gl-container">
		<div className="gl-gamepanel">
			{game == null ? <div className="gl-loading-spinner"><Spinner size="l" /> </div> :
				<>
					<div className="gl-gametitle-div">
						<div className="gl-gameicon"></div>
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
									console.log(game.tgLink());
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
								window.postMessage({
									dashfun: {
										method: "getUserProfile"
									}
								}, "*");

								const eventListener = (ev: MessageEvent<any>) => {
									const { data } = ev;
									if (data.dashfun) {
										const { method, result } = data.dashfun;
										if (method == "requestPaymentResult" && result.state == "success") {
											const { invoiceLink, paymentId } = result.data;
											console.log(invoiceLink, paymentId)
											window.removeEventListener('message', eventListener)
											window.postMessage({
												dashfun: {
													method: "openInvoice",
													value: invoiceLink
												}
											})
										}
									}
								}

								window.addEventListener('message', eventListener)
								window.postMessage({
									dashfun: {
										method: "requestPayment",
										gameId,
										title: "Test Item",
										desc: "for payment test",
										payload: "dashfun payload",
										price: 1
									}
								}, "*")
							}}
						>
							<i className="fa-regular fa-heart"></i>&nbsp;
						</Button>
					</div>
				</>}
		</div>
		<div className="gl-playbutton">
			<Button size="m" stretched loading={game == null} onClick={_ => {
				onPlayClicked?.call([]);
			}}>Play</Button>
		</div>
	</div>
}