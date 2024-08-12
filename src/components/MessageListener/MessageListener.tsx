import { PaymentApi } from "@/utils/DashFunApi";
import { InitData, initInitData, initInvoice, initUtils, useInitData, useLaunchParams, Utils } from "@telegram-apps/sdk-react";
import { FC, useEffect } from "react";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { DashFunUser } from "../DashFunData/UserData";
import { DashFunEvents } from "./Events";

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
	sendResult(ctx.source, method, new Result("success", ctx.initData.user))
}

const onOpenTelegramLink = (ctx: Context) => {
	console.log("invoke onOpenTelegramLink")
	const { value } = ctx.callData;
	ctx.utils.openTelegramLink(value);
}

const onOpenInvoice = (ctx: Context) => {
	const { value } = ctx.callData;
	const invoice = initInvoice();
	console.log("opening invoice", value)
	invoice.on("change:isOpened", (v: boolean) => {
		console.log(`invoice [${value}] open status changed: `, v)
	})
	invoice.open(value, "url").then((status) => {
		console.log(`invoice ${value} status changed:`, status);
	}).catch(e => {
		console.error(e);
	});
}

const onRequestPayment = (ctx: Context) => {
	const { method, gameId, title, desc, payload, price } = ctx.callData
	PaymentApi.requestPayment(ctx.initDataRaw, {
		game_id: gameId,
		title,
		desc,
		payload,
		price
	}).then(result => {
		console.log("pppp result ====", result)
		const r = new Result("success", result);
		sendResult(ctx.source, method, r)
	}).catch(e => {
		console.error(e);
		const r = new Result("error", e);
		sendResult(ctx.source, method, r)
	})
}


const processors: { [key: string]: (ctx: Context) => void } = {};
processors[DashFunEvents.getUserProfile] = onGetUserProfile;
processors[DashFunEvents.openTelegramLink] = onOpenTelegramLink;
processors[DashFunEvents.openInvoice] = onOpenInvoice;
processors[DashFunEvents.requestPayment] = onRequestPayment

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

	}, [initData, initDataRaw]);

	return <></>
}