import btnAdd from "@/assets/Btn_Add_Green.png";
import { Coin, CoinUserData, getCoinIcon1 } from "@/constats";
import { Avatar, ButtonCell, Cell, Section } from "@telegram-apps/telegram-ui";
import { SectionFooter } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import { Wallet } from "lucide-react";
import { FC } from "react";
import { useDashFunCoins } from "../DashFun/DashFunCoins";
import { GameData } from "../DashFunData/GameData";
import { DashFunUser } from "../DashFunData/UserData";
import Number from "../Utils/Number";

export const Coins: FC<{ game: GameData | null, user: DashFunUser | null, onSelected: (coin: Coin) => void }> = ({ game }) => {

	const [coins, _2, _3, getCoinInfo] = useDashFunCoins();

	if (coins == null || game == null) {
		return null;
	}

	const coin = getCoinInfo(game.id, "gameId");
	const withdraw = coin?.coin.can_withdraw && coin.coin.min_withdraw > 0 ? <>
		<ButtonCell
			className="" disabled={true}
			before={<Wallet absoluteStrokeWidth />}
		>Withdraw</ButtonCell>
		<SectionFooter>Minimum withdrawal amount is {coin?.coin.min_withdraw} {coin?.coin.symbol}</SectionFooter></>
		: null

	return <div className=" w-full justify-center items-center p-4">
		<Section>
			<Cell
				subtitle={"Your Earning: " + coin?.userData.amount.toLocaleString('en-US', { style: "decimal" }) + " " + coin?.coin.symbol}
				before={<Avatar src={getCoinIcon1(coin?.coin ?? null)} size={40} />}
			>
				{coin?.coin.name}
			</Cell>
			{/* <ButtonCell
				className="" disabled={true}
				before={<i className="fa-solid fa-wallet"></i>}
			>Withdraw</ButtonCell>

			{
				coin?.coin.can_withdraw && coin.coin.min_withdraw > 0 && (
					<SectionFooter>Minimum withdrawal amount is {coin?.coin.min_withdraw} {coin?.coin.symbol}</SectionFooter>
				)
			} */}
			{withdraw}
		</Section>
	</div>
}

export const CoinPanel: FC<{ coin: Coin | null | undefined, userCoinData: CoinUserData | null | undefined, showAdd?: boolean, forceDark?: boolean, onClick?: () => void }> = ({ coin, userCoinData, showAdd = false, forceDark = false, onClick }) => {
	return <div className="flex flex-row w-full justify-center items-center relative " style={{ height: 28 }} onClick={onClick}>
		<div className="w-full flex flex-row" style={{ height: 24 }}>
			<div className={` bg-blue-400 rounded-l-md w-full h-full ${forceDark ? " bg-opacity-30" : " bg-opacity-70"}`}></div>
			<div className=" h-full" style={{ width: 14 }}></div>
		</div>
		<Number className="absolute text-white text-sm font-semibold w-full text-right pr-[34px]" value={userCoinData?.amount || 0}></Number>
		<div className="rounded-full absolute right-0">
			<img className="" src={getCoinIcon1(coin)} style={{ height: 28 }} />
		</div>
		{showAdd && <img className="absolute left-2 top-1" width={20} src={btnAdd}></img>}
	</div >
}