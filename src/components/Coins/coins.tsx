import { Coin, getCoinIcon } from "@/constats";
import { Avatar, ButtonCell, Cell, Section } from "@telegram-apps/telegram-ui";
import { SectionFooter } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionFooter/SectionFooter";
import { FC } from "react";
import { UseDashFunCoins } from "../DashFun/DashFunCoins";
import { GameData } from "../DashFunData/GameData";
import { DashFunUser } from "../DashFunData/UserData";

export const Coins: FC<{ game: GameData | null, user: DashFunUser | null, onSelected: (coin: Coin) => void }> = () => {
	const coins = UseDashFunCoins();
	console.log(coins, coins.findCoinByName("DashFunPoint"))

	if (coins == null) {
		return null;
	}

	const coin = coins.findCoinByName("DashFunPoint")

	return <div className=" w-full justify-center items-center p-4">
		<Section>
			<Cell
				subtitle={"total balance " + coin?.userData.amount.toLocaleString('en-US', { style: "decimal" }) + " " + coin?.coin.symbol}
				before={<Avatar src={getCoinIcon(coin?.coin.name as string)} size={40} />}
			>
				{coin?.coin.name}
			</Cell>
			<ButtonCell
				className="" disabled={true}
				before={<i className="fa-solid fa-wallet"></i>}
			>Withdraw</ButtonCell>

			{
				coin?.coin.can_withdraw && coin.coin.min_withdraw > 0 && (
					<SectionFooter>Minimum withdrawal amount is {coin?.coin.min_withdraw} {coin?.coin.symbol}</SectionFooter>
				)
			}
		</Section>
	</div>
}