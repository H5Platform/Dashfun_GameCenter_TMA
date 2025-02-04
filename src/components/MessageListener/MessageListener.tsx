import { GameApi, PaymentApi } from "@/utils/DashFunApi";
import {
	initData,
	invoice,
	openTelegramLink,
	useSignal
} from "@telegram-apps/sdk-react";
import { FC, useEffect } from "react";
import { useDashFunGame } from "../DashFun/DashFunGame";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { GameData } from "../DashFunData/GameData";
import { DashFunUser } from "../DashFunData/UserData";
import { GameLoadingEvent } from "../Event/Events";
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
	const { invoiceLink, paymentId } = payload;

	if (invoiceLink.startsWith("test-")) {
		sendResult(ctx.source, method, new Result("success", { paymentId, status: "paid" }))
	} else {
		console.log("opening invoice", invoiceLink)
		invoice.open(invoiceLink, "url").then((status) => {
			console.log(`invoice ${invoiceLink} status changed:`, status);
			sendResult(ctx.source, method, new Result("success", { paymentId, status }))
		}).catch(e => {
			console.error(e);
		});
	}
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
	GameApi.setData(ctx.dfGame.id, ctx.initDataRaw, key, data)
		.then(result => {
			const r = new Result("success", result);
			sendResult(ctx.source, method, r)
		}).catch(e => {
			console.error(e);
			const r = new Result("error", e);
			sendResult(ctx.source, method, r)
		})
}

const onGetData = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { key } = payload
	GameApi.getData(ctx.dfGame.id, ctx.initDataRaw, key)
		.then(result => {
			const r = new Result("success", result);
			sendResult(ctx.source, method, r)
		}).catch(e => {
			console.error(e);
			const r = new Result("error", e);
			sendResult(ctx.source, method, r)
		})
}

const onGetDataV2 = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { key } = payload
	GameApi.getDataV2(ctx.dfGame.id, ctx.initDataRaw, key)
		.then(result => {
			const r = new Result("success", result);
			sendResult(ctx.source, method, r)
		}).catch(e => {
			console.error(e);
			const r = new Result("error", e);
			sendResult(ctx.source, method, r)
		})
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

	const eventListener = (ev: MessageEvent<any>) => {
		console.log("receive message", ev);
		const { data } = ev;
		if (data.dashfun) {
			const { method } = data.dashfun;
			const f = processors[method];
			if (f != null) f(new Context(ev.source as Window, data.dashfun, game as GameData, dfUser as DashFunUser, initDataRaw as string));
		}
	}
	useEffect(() => {
		window.addEventListener('message', eventListener)
		return () => {
			window.removeEventListener('message', eventListener);
		}

	}, [initData, initDataRaw, dfUser, game]);

	return <></>
}