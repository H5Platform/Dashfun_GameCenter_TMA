import { PaymentApi } from "@/utils/DashFunApi";
import {
	initData,
	openTelegramLink,
	useSignal
} from "@telegram-apps/sdk-react";
import { FC, useCallback, useEffect } from "react";
import { useDashFunGame } from "../DashFun/DashFunGame";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { GameData } from "../DashFunData/GameData";
import { DashFunUser } from "../DashFunData/UserData";
import { GameLoadingEvent, OpenDashFunPaymentEvent } from "../Event/Events";
import GameSaveMgr from "../GameSaveMgr/GameSaveMgr";
import { DashFunMessages } from "./Messages";

class Context {
	callData: any;
	dfUser: DashFunUser;
	initDataRaw: string;
	source: Window;
	dfGame: GameData;

	constructor(source: Window, callData: any, dfGame: GameData, dfUser: DashFunUser, initDataRaw: string) {
		this.dfUser = dfUser;
		this.callData = callData;
		this.initDataRaw = initDataRaw;
		this.source = source;
		this.dfGame = dfGame;
	}
}

class Result {
	state: "success" | "error"
	data: any

	constructor(state: "success" | "error", data: any) {
		this.state = state;
		this.data = data;
	}
}

const sendResult = (source: Window, method: string, result: Result) => {
	const payload = {
		dashfun: {
			method: method + "Result",
			result: result,
		}
	}
	source.postMessage(payload, "*")
}

const onGetUserProfile = (ctx: Context) => {
	const { method } = ctx.callData;
	sendResult(ctx.source, method, new Result("success", ctx.dfUser))
	console.log("send user profile:", ctx.dfUser)
}

const onOpenTelegramLink = (ctx: Context) => {
	console.log("invoke onOpenTelegramLink")
	const { value } = ctx.callData.payload;
	openTelegramLink(value);
}

const onOpenInvoice = (ctx: Context) => {
	const { method, payload } = ctx.callData;
	console.log("open invoice payload:", payload)
	const { paymentId } = payload;

	// if (invoiceLink.startsWith("test-")) {
	// 	sendResult(ctx.source, method, new Result("success", { paymentId, status: "paid" }))
	// } else {
	// 	console.log("opening invoice", invoiceLink)
	// 	invoice.open(invoiceLink, "url").then((status) => {
	// 		console.log(`invoice ${invoiceLink} status changed:`, status);
	// 		sendResult(ctx.source, method, new Result("success", { paymentId, status }))
	// 	}).catch(e => {
	// 		console.error(e);
	// 	});
	// }

	//open dashfun payment
	const onResult = (success: boolean, msg: string) => {
		sendResult(ctx.source, method, new Result(success ? "success" : "error", { paymentId, status: success ? "paid" : "error", msg }))
	}

	OpenDashFunPaymentEvent.fire(paymentId, onResult);

}

const onRequestPayment = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { title, desc, info, price } = payload
	PaymentApi.requestPayment(ctx.initDataRaw, {
		game_id: ctx.dfGame.id,
		title,
		desc,
		payload: info,
		price
	}).then(result => {
		const r = new Result("success", result);
		sendResult(ctx.source, method, r)
	}).catch(e => {
		console.error(e);
		const r = new Result("error", e);
		sendResult(ctx.source, method, r)
	})
}

const onSetData = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { key, data } = payload
	const gameSaveMgr = GameSaveMgr.getInstance();

	gameSaveMgr.getGameSaveData().then(gameSaveData => {
		gameSaveData.set(key, data);
		gameSaveMgr.saveGameSaveData();
		const r = new Result("success", { ...gameSaveData.data });
		sendResult(ctx.source, method, r)
	}).catch(e => {
		console.error(e);
		const r = new Result("error", e);
		sendResult(ctx.source, method, r)
	})

	// GameApi.setData(ctx.dfGame.id, ctx.initDataRaw, key, data)
	// 	.then(result => {
	// 		const r = new Result("success", result);
	// 		sendResult(ctx.source, method, r)
	// 	}).catch(e => {
	// 		console.error(e);
	// 		const r = new Result("error", e);
	// 		sendResult(ctx.source, method, r)
	// 	})
}

const onGetData = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { key } = payload

	const gameSaveMgr = GameSaveMgr.getInstance();;

	gameSaveMgr.getGameSaveData().then(gameSaveData => {
		const r = new Result("success", gameSaveData.get(key));
		sendResult(ctx.source, method, r)
	}).catch(e => {
		console.error(e);
		const r = new Result("error", e);
		sendResult(ctx.source, method, r)
	})

	// GameApi.getData(ctx.dfGame.id, ctx.initDataRaw, key)
	// 	.then(result => {
	// 		const r = new Result("success", result);
	// 		sendResult(ctx.source, method, r)
	// 	}).catch(e => {
	// 		console.error(e);
	// 		const r = new Result("error", e);
	// 		sendResult(ctx.source, method, r)
	// 	})
}

const onGetDataV2 = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { key } = payload
	const gameSaveMgr = GameSaveMgr.getInstance();;

	gameSaveMgr.getGameSaveData().then(gameSaveData => {
		const r = new Result("success", { key, data: gameSaveData.get(key) });
		sendResult(ctx.source, method, r)
	}).catch(e => {
		console.error(e);
		const r = new Result("error", e);
		sendResult(ctx.source, method, r)
	})

	// GameApi.getDataV2(ctx.dfGame.id, ctx.initDataRaw, key)
	// 	.then(result => {
	// 		const r = new Result("success", result);
	// 		sendResult(ctx.source, method, r)
	// 	}).catch(e => {
	// 		console.error(e);
	// 		const r = new Result("error", e);
	// 		sendResult(ctx.source, method, r)
	// 	})
}

const onLoading = (ctx: Context) => {
	const { payload } = ctx.callData
	let { value } = payload;

	if (value == null) {
		value = 0
	}
	GameLoadingEvent.fire(value);
}


const processors: { [key: string]: (ctx: Context) => void } = {};
processors[DashFunMessages.getUserProfile] = onGetUserProfile;
processors[DashFunMessages.openTelegramLink] = onOpenTelegramLink;
processors[DashFunMessages.openInvoice] = onOpenInvoice;
processors[DashFunMessages.requestPayment] = onRequestPayment;
processors[DashFunMessages.loading] = onLoading;
processors[DashFunMessages.getData] = onGetData;
processors[DashFunMessages.getDataV2] = onGetDataV2;
processors[DashFunMessages.setData] = onSetData;

export const MessageListener: FC = () => {
	const initDataRaw = useSignal(initData.raw)
	const dfUser = useDashFunUser();
	const game = useDashFunGame();

	const eventListener = useCallback((ev: MessageEvent<any>) => {
		console.log("receive message", ev);
		const { data } = ev;
		if (data.dashfun) {
			const { method } = data.dashfun;
			const f = processors[method];
			if (f != null) {
				const context = new Context(
					ev.source as Window,
					data.dashfun,
					game as GameData,
					dfUser as DashFunUser,
					initDataRaw as string,
				)
				f(context);
			}
		}
	}, [dfUser, game, initDataRaw])

	useEffect(() => {
		if (dfUser != null && game != null) {
			GameSaveMgr.getInstance().setContext(dfUser.id, initDataRaw as string, game.id)
			GameSaveMgr.getInstance().getGameSaveData();
		}
	}, [initData, initDataRaw, dfUser, game]);

	useEffect(() => {
		window.addEventListener('message', eventListener)
		return () => {
			window.removeEventListener('message', eventListener);
		}
	}, [eventListener])

	return <></>
}