import { UserApi } from "@/utils/DashFunApi";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Spinner } from "@telegram-apps/telegram-ui";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { DashFunUser } from "../DashFunData/UserData";


const UserContext = createContext<{
	user: DashFunUser | null,
} | null>(null);


export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<DashFunUser | null>(null)
	const initDataRaw = useSignal(initData.raw)
	const initDataState = useSignal(initData.state)

	const loginUser = async () => {
		if (initDataRaw == null) return;
		const dfUser = await UserApi.tgLogin(initDataRaw as string);
		dfUser.language = initDataState?.user?.languageCode as string
		setUser(dfUser);
	}

	useEffect(() => {
		if (initData == null || initData.user == null) {
			return;
		}
		if (user == null || user.channelId != initDataState?.user?.id.toString()) {
			loginUser();
		}
	}, [initDataState?.user?.id, initDataRaw])

	return <UserContext.Provider value={{ user }}>
		{user == null ? <div className="w-full h-full items-center justify-center flex"><Spinner size={"l"} /></div> : children}
	</UserContext.Provider>
}


export const useDashFunUser = (): DashFunUser | null | undefined => {
	const context = useContext(UserContext);
	return context?.user;
}
