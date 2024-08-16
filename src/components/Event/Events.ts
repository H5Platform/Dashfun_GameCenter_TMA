
const EventTypes = {
	GameLoading: 1,
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


// class NewUserEvents extends EventBase {
// 	constructor() {
// 		super(EventTypes.NewUser);
// 	}
// 	/**
// 	 * @override 
// 	 * @param {function(User)} listener 
// 	 */
// 	addListener(listener) {
// 		super.addListener(listener);
// 	}

// 	/**
// 	 * @override
// 	 * @param {function(User)} listener 
// 	 */
// 	removeListener(listener) {
// 		super.removeListener(listener);
// 	}
// 	/**
// 	 * @override
// 	 * @fires EventTypes.NewFirebaseClientEvent
// 	 * @param {User} user
// 	 */
// 	fire(user) {
// 		super.fire(user);
// 	}
// }

// class UserLoginEvents extends EventBase {
// 	constructor() {
// 		super(EventTypes.UserLogin);
// 	}
// 	/**
// 	 * @override 
// 	 * @param {function(User)} listener 
// 	 */
// 	addListener(listener) {
// 		super.addListener(listener);
// 	}

// 	/**
// 	 * @override
// 	 * @param {function(User)} listener 
// 	 */
// 	removeListener(listener) {
// 		super.removeListener(listener);
// 	}
// 	/**
// 	 * @override
// 	 * @fires EventTypes.NewFirebaseClientEvent
// 	 * @param {User} user
// 	 */
// 	fire(user) {
// 		super.fire(user);
// 	}
// }

// class UserLogoffEvents extends EventBase {
// 	constructor() {
// 		super(EventTypes.UserLogoff);
// 	}
// 	/**
// 	 * @override 
// 	 * @param {function(User)} listener 
// 	 */
// 	addListener(listener) {
// 		super.addListener(listener);
// 	}

// 	/**
// 	 * @override
// 	 * @param {function(User)} listener 
// 	 */
// 	removeListener(listener) {
// 		super.removeListener(listener);
// 	}
// 	/**
// 	 * @override
// 	 * @fires EventTypes.NewFirebaseClientEvent
// 	 * @param {User} user
// 	 */
// 	fire(user) {
// 		super.fire(user);
// 	}
// }
// const NewUserEvent = new NewUserEvents();
// const UserLoginEvent = new UserLoginEvents();
// const UserLogoffEvent = new UserLogoffEvents();
// const UserRefreshedEvent = new UserRefreshedEvents();

const GameLoadingEvent = new GameLoadingEvents();

export { GameLoadingEvent }