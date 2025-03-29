import { Coin } from "@/constats";
import { DashFunUser } from "../DashFunData/UserData";
import { GameData } from "../DashFunData/GameData";
import { PaymentData } from "@/utils/DashFunApi";

const EventTypes = {
	GameLoading: 1,
	TaskStatusChanged: 50,
	CoinChanged: 100,
	SpinWheelStatusChanged: 150,
	OpenDashFunPayment: 200,
	OpenDashFunRecharge: 250,

	UserLogin: 1001,
	GameDataLoaded: 1002,
	UserEnterGame: 1003,
	UserPayment: 1004,
	UserRecharge: 1005,
}


const EvtListeners: { [key: number]: ((p: any[]) => void)[] } = {};

/**
 * 
 * @param {EventTypes} evtType 
 * @returns {function(p:any):void[]}
 */
const getEvtListeners = (evtType: number): ((...p: any[]) => void)[] => {
	if (EvtListeners[evtType] == null) {
		EvtListeners[evtType] = [];
	}
	return EvtListeners[evtType];
}

class EventBase {
	#evtType: number;

	constructor(type: number) {
		this.#evtType = type;
	}

	addListener(listener: ((...p: any[]) => void)) {
		const listeners = getEvtListeners(this.#evtType);
		listeners.push(listener)
	}

	removeListener(listener: ((...p: any[]) => void)) {
		const listeners = getEvtListeners(this.#evtType);
		const idx = listeners.indexOf(listener);
		if (idx > 0) {
			listeners.splice(idx, 1);
		}
	}

	fire(...args: any[]) {
		const listeners = getEvtListeners(this.#evtType);
		listeners.forEach(l => {
			l(...args);
		})
	}
}

class GameLoadingEvents extends EventBase {
	constructor() {
		super(EventTypes.GameLoading);
	}

	/**
	 * @overload
	 * @param listener 
	 */
	addListener(listener: ((value: number) => void)): void {
		super.addListener(listener);
	}

	/**
	 * 
	 * @param value range(0-100)
	 */
	fire(value: number): void {
		super.fire(value)
	}
}

class TaskStatusChangedEvents extends EventBase {
	constructor() {
		super(EventTypes.TaskStatusChanged);
	}

	/**
	 * @overload
	 * @param listener 
	 */
	addListener(listener: ((taskId: string, status: number) => void)): void {
		super.addListener(listener);
	}

	/**
	 * 
	 * @param value range(0-100)
	 */
	fire(taskId: string, status: number): void {
		console.log("fire task status changed event", taskId, status)
		super.fire(taskId, status)
	}

}

class SpinWheelStatusChangedEvents extends EventBase {
	constructor() {
		super(EventTypes.SpinWheelStatusChanged);
	}

	/**
	 * @overload
	 * @param listener 
	 */
	addListener(listener: ((spinwheelId: string, status: number) => void)): void {
		super.addListener(listener);
	}

	/**
	 * 
	 * @param value range(0-100)
	 */
	fire(spinwheelId: string, status: number): void {
		console.log("fire spinwheelId status changed event", spinwheelId, status)
		super.fire(spinwheelId, status)
	}

}

class CoinChangedEvents extends EventBase {
	constructor() {
		super(EventTypes.CoinChanged);
	}

	/**
	 * @overload
	 * @param listener 
	 */
	addListener(listener: (coin: Coin, changed: number) => void): void {
		super.addListener(listener);
	}

	/**
	 * 
	 * @param changed 变化数量,>0增加，<0减少
	 */
	fire(coin: Coin, changed: number): void {
		super.fire(coin, changed)
	}
}

class OpenDashFunPaymentEvents extends EventBase {
	constructor() {
		super(EventTypes.OpenDashFunPayment);
	}

	addListener(listener: (paymentId: string, onResult: (success: boolean, msg: string) => void) => void): void {
		super.addListener(listener);
	}

	fire(paymentId: string, onResult: (success: boolean, msg: string) => void): void {
		super.fire(paymentId, onResult)
	}
}

class OpenDashFunRechargeEvents extends EventBase {
	constructor() {
		super(EventTypes.OpenDashFunRecharge);
	}

	addListener(listener: (minRechargeValue: number) => void): void {
		super.addListener(listener);
	}

	fire(minRechargeValue: number): void {
		super.fire(minRechargeValue)
	}
}

class UserLoginEvents extends EventBase {
	constructor() {
		super(EventTypes.UserLogin);
	}

	addListener(listener: (user: DashFunUser) => void): void {
		super.addListener(listener);
	}

	fire(user: DashFunUser): void {
		super.fire(user)
	}
}


class GameDataLoadedEvents extends EventBase {
	constructor() {
		super(EventTypes.GameDataLoaded);
	}

	addListener(listener: (game: GameData) => void): void {
		super.addListener(listener);
	}

	fire(game: GameData): void {
		super.fire(game)
	}
}


const GameLoadingEvent = new GameLoadingEvents();
const CoinChangedEvent = new CoinChangedEvents();
const TaskStatusChangedEvent = new TaskStatusChangedEvents();
const SpinWheelStatusChangedEvent = new SpinWheelStatusChangedEvents();
const OpenDashFunPaymentEvent = new OpenDashFunPaymentEvents();
const OpenDashFunRechargeEvent = new OpenDashFunRechargeEvents();


class UserEnterGameEvents extends EventBase {
	constructor() {
		super(EventTypes.UserEnterGame);
	}

	addListener(listener: (game: GameData) => void): void {
		super.addListener(listener);
	}

	fire(game: GameData): void {
		super.fire(game);
	}
}

class UserPaymentEvents extends EventBase {
	constructor() {
		super(EventTypes.UserPayment);
	}

	addListener(listener: (payment: PaymentData, status: "pending" | "success" | "canceled") => void): void {
		super.addListener(listener);
	}

	fire(payment: PaymentData, status: "pending" | "success" | "canceled"): void {
		super.fire(payment, status)
	}
}

class UserRechargeEvents extends EventBase {
	constructor() {
		super(EventTypes.UserRecharge);
	}

	addListener(listener: (orderId: string, amount: number, currencyType: string, status: "pending" | "success" | "canceled", payFrom: string) => void): void {
		super.addListener(listener);
	}

	fire(orderId: string, amount: number, currencyType: string, status: "pending" | "success" | "canceled", payFrom: string): void {
		super.fire(orderId, amount, currencyType, status, payFrom);
	}
}


//game events
const UserLoginEvent = new UserLoginEvents();
const GameDataLoadedEvent = new GameDataLoadedEvents();
const UserEnterGameEvent = new UserEnterGameEvents();
const UserPaymentEvent = new UserPaymentEvents();
const UserRechargeEvent = new UserRechargeEvents();

export {
	OpenDashFunRechargeEvent, GameLoadingEvent, CoinChangedEvent, TaskStatusChangedEvent,
	SpinWheelStatusChangedEvent, OpenDashFunPaymentEvent,

	UserLoginEvent, GameDataLoadedEvent, UserEnterGameEvent, UserPaymentEvent, UserRechargeEvent
}