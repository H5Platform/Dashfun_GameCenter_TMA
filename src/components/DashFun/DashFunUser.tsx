import { UserApi } from "@/utils/DashFunApi"
import { useInitData, useLaunchParams } from "@telegram-apps/sdk-react"
import { useEffect, useState } from "react"
import { DashFunUser } from "../DashFunData/UserData"

const useDashFunUser = (): DashFunUser | null => {
	const [user, setUser] = useState<DashFunUser | null>(null)
	const initData = useInitData();
	const initDataRaw = useLaunchParams().initDataRaw;

	const loginUser = async () => {
		if (initDataRaw == null) return;
		const dfUser = await UserApi.tgLogin(initDataRaw as string);
		dfUser.language = initData?.user?.languageCode as string
		setUser(dfUser);
	}

	useEffect(() => {
		if (initData == null || initData.user == null) {
			return;
		}
		if (user == null || user.channelId != initData.user.id.toString()) {
			loginUser();
		}

	}, [initData?.user?.id, initDataRaw])

	return user;
}

export { useDashFunUser }
