import { DFProfileAvatar } from "@/components/Avatar/Avatar";
import { CoinPanel } from "@/components/Coins/coins";
import { useDashFunCoins } from "@/components/DashFun/DashFunCoins";
import { useDashFunUser } from "@/components/DashFun/DashFunUser";
import { themeParams } from "@telegram-apps/sdk-react";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileHeader: FC<{ disableClick?: boolean }> = ({ disableClick = false }) => {
	const navigator = useNavigate();
	const user = useDashFunUser();
	const l = useLocation();

	const forceDark = l.pathname.endsWith("/main") || themeParams.isDark();
	const [_1, _2, _3, getCoinInfo] = useDashFunCoins();

	const dp = getCoinInfo("DashFunPoint", "name");
	const dc = getCoinInfo("DashFunCoin", "name");
	const dd = getCoinInfo("DashFunDiamond", "name");

	//<div className="flex flex-col items-center w-full gap-2 rounded-xl px-3 py-2 bg-white bg-opacity-10 border-2 border-opacity-30 border-gray-200 " >

	return <div className="flex flex-col items-center w-full gap-2 " >
		<div className="relative w-full">
			<p className={`absolute  rounded-l-md  pl-6 pr-4 py-[1px] \
				rounded-md bottom-[4px] left-[35px] text-sm font-semibold bg-blue-400 text-white ${forceDark ? " bg-opacity-30" : " bg-opacity-70"}`}>
				{"Lv." + (user?.level || 1)}
			</p>

			<div className="flex flex-row items-start w-full h-full max-w-full">
				<DFProfileAvatar size={56} onClick={() => {
					!disableClick && navigator("/game-center/profile");
				}} />
				<div className="flex flex-col h-full flex-1 justify-start min-w-0">
					<span className={`font-semibold text-lg pl-1 truncate overflow-hidden ${forceDark ? "text-white" : ""}`} style={{ maxWidth: "calc(100% - 56px)" }}>
						{user?.displayName}
					</span>
				</div>
				<div>
					{/* 右边部分 */}
				</div>
			</div>
		</div>

		<div className="flex pt-1 items-center  justify-between w-full gap-2">
			<CoinPanel coin={dp?.coin} userCoinData={dp?.userData} forceDark={forceDark} />
			<CoinPanel coin={dc?.coin} userCoinData={dc?.userData} forceDark={forceDark} />
			<CoinPanel coin={dd?.coin} userCoinData={dd?.userData} forceDark={forceDark} showAdd onClick={() => {
				navigator("/game-center/recharge");
			}} />
		</div>
	</div >
}

export default ProfileHeader;