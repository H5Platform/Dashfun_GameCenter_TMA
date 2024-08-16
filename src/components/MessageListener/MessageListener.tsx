import { PaymentApi } from "@/utils/DashFunApi";
import { InitData, initInitData, initInvoice, initUtils, useInitData, useLaunchParams, Utils } from "@telegram-apps/sdk-react";
import { FC, useEffect } from "react";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { DashFunUser } from "../DashFunData/UserData";
import { DashFunMessages } from "./Messages";
import { GameLoadingEvent } from "../Event/Events";

class Context {
	callData: any;
	initData: InitData;
	utils: Utils;
	dfUser: DashFunUser;
	initDataRaw: string;
	source: Window

	constructor(source: Window, callData: any, dfUser: DashFunUser, initDataRaw: string) {
		this.initData = initInitData() as InitData;
		this.dfUser = dfUser;
		this.callData = callData;
		this.utils = initUtils();
		this.initDataRaw = initDataRaw;
		this.source = source;
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
}

const onOpenTelegramLink = (ctx: Context) => {
	console.log("invoke onOpenTelegramLink")
	const { value } = ctx.callData.payload;
	ctx.utils.openTelegramLink(value);
}

const onOpenInvoice = (ctx: Context) => {
	const { method, payload } = ctx.callData;
	const { invoiceUrl, paymentId } = payload;
	const invoice = initInvoice();
	console.log("opening invoice", invoiceUrl)
	invoice.open(invoiceUrl, "url").then((status) => {
		console.log(`invoice ${invoiceUrl} status changed:`, status);
		sendResult(ctx.source, method, new Result("success", { paymentId, status }))
	}).catch(e => {
		console.error(e);
	});
}

const onRequestPayment = (ctx: Context) => {
	const { method, payload } = ctx.callData
	const { gameId, title, desc, info, price } = payload
	PaymentApi.requestPayment(ctx.initDataRaw, {
		game_id: gameId,
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

export const MessageListener: FC = () => {
	const initDataRaw = useLaunchParams().initDataRaw;
	const initData = useInitData();
	const dfUser = useDashFunUser();

	const eventListener = (ev: MessageEvent<any>) => {
		console.log("receive message", ev);
		const { data } = ev;
		if (data.dashfun) {
			const { method } = data.dashfun;
			const f = processors[method];
			if (f != null) f(new Context(ev.source as Window, data.dashfun, dfUser as DashFunUser, initDataRaw as string));
		}
	}
	useEffect(() => {
		window.addEventListener('message', eventListener)
		return () => {
			window.removeEventListener('message', eventListener);
		}

	}, [initData, initDataRaw, dfUser]);

	return <></>
}