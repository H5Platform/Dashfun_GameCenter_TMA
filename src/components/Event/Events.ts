import { Coin } from "@/constats";

const EventTypes = {
	GameLoading: 1,
	TaskStatusChanged: 50,
	CoinChanged: 100,
	SpinWheelStatusChanged: 150,
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

const GameLoadingEvent = new GameLoadingEvents();
const CoinChangedEvent = new CoinChangedEvents();
const TaskStatusChangedEvent = new TaskStatusChangedEvents();
const SpinWheelStatusChangedEvent = new SpinWheelStatusChangedEvents();

export { GameLoadingEvent, CoinChangedEvent, TaskStatusChangedEvent, SpinWheelStatusChangedEvent }