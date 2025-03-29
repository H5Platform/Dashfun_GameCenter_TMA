import { UserApi } from "@/utils/DashFunApi";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Spinner } from "@telegram-apps/telegram-ui";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { DashFunUser } from "../DashFunData/UserData";
import { useLocation } from "react-router-dom";
import { UserLoginEvent } from "../Event/Events";


const UserContext = createContext<{
	user: DashFunUser | null,
	avatar: string | null,
} | null>(null);


export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<DashFunUser | null>(null)
	const [avatar, setAvatar] = useState<string | null>(null)
	const initDataRaw = useSignal(initData.raw)
	const initDataState = useSignal(initData.state)
	const l = useLocation();

	let referrerId = "";
	if (l.pathname.includes("game-center")) {
		//is game-center
		referrerId = initDataState?.startParam as string || "";
	}

	const loginUser = async () => {
		if (initDataRaw == null) return;
		const dfUser = await UserApi.tgLogin(initDataRaw as string, referrerId);
		dfUser.language = initDataState?.user?.languageCode as string
		setUser(dfUser);
		UserLoginEvent.fire(dfUser);
	}

	const getAvatar = async () => {
		if (initDataRaw == null) return;
		const avatar = await UserApi.getAvatar(initDataRaw as string);
		setAvatar(avatar);
	}

	useEffect(() => {
		if (initData == null || initData.user == null) {
			return;
		}
		if (user == null || user.channelId != initDataState?.user?.id.toString()) {
			loginUser();
			getAvatar();
		}

	}, [initDataState?.user?.id, initDataRaw])

	return <UserContext.Provider value={{ user, avatar }}>
		{user == null ? <div className="w-full h-full items-center justify-center flex"><Spinner size={"l"} /></div> : children}
	</UserContext.Provider>
}


export const useDashFunUser = (): DashFunUser | null | undefined => {
	const context = useContext(UserContext);
	return context?.user;
}

export const useDashFunAvatar = (): string => {
	const context = useContext(UserContext);
	return context?.avatar ?? "";
}
