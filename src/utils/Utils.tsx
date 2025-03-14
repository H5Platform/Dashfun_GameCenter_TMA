import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getEnv } from "./DashFunApi";

export const toTimeString = (days: number, hours: number, minutes: number, seconds: number) => {
	let ret = "";
	if (days > 1) {
		ret += days + " days "
	} else if (days == 1) {
		ret += days + " day "
	}
	ret += `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	return ret;
}

export const isPcBrowser = () => {
	return !/Mobi|Android/i.test(navigator.userAgent);
};

const telegramPlatforms = ["tdesktop", "android", "ios", "macos", "web"]
export const isInTelegram = () => {
	const platform = retrieveLaunchParams().platform;
	return telegramPlatforms.includes(platform);
}

export const channelSaveKey = () => {
	return "DashFun-LoginChannel-" + getEnv();
}

export const orderSaveKey = (userId: string) => {
	return "DashFun-Order-" + userId;
}

export const currentChannel = () => {
	return localStorage.getItem(channelSaveKey()) || "tg";
}