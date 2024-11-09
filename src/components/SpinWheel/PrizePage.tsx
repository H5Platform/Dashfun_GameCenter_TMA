import { getCoinIcon } from "@/constats";
import { FC, useState } from "react";
import { DashFunCoins } from "../DashFun/DashFunCoins";
import { useDashFunSpinWheel } from "../DashFun/DashFunSpinWheel";
import { SpinWheelConstants } from "../DashFunData/SpinWheelData";
import { SpinWheelStatusChangedEvent } from "../Event/Events";

const PrizePage: FC<{ coins: DashFunCoins, setCanClaim: (value: boolean) => void }> = ({ coins, setCanClaim }) => {
  const [loading, setLoading] = useState(false);

  const [spinWheel, _, claim] = useDashFunSpinWheel();

  const reward = spinWheel?.rewards[spinWheel?.rewardIndex];

  const spinWheelStatus = spinWheel?.status;

  //目前奖励只有一种类型，奖励对应的游戏币
  const coin = coins.findCoinByGameId(spinWheel?.gameId || "");

  const onClaim = async () => {
    setLoading(true);
    try {
      const claimRes = await claim();
      SpinWheelStatusChangedEvent.fire(spinWheel.id, SpinWheelConstants.Status.Claimed);
      console.log("claim res", claimRes);
      setTimeout(() => {
        setCanClaim(false);
      }, 5000);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full">
      <img src={coin == null ? "" : getCoinIcon(coin.coin.name)} alt="prize" />
      {spinWheelStatus == SpinWheelConstants.Status.CanClaim ? (
        <div className="self-start w-full">
          <p className="text-xl text-center">{reward?.value} {coin?.coin.name}</p>
          <button
            className={`${loading ? "bg-gray-500" : "bg-blue-500"
              } w-full text-xl font-bold text-white py-2 rounded-md block`}
            onClick={onClaim}
            disabled={loading}
          >
            {loading ? "Grabing..." : "Grab the prize"}
          </button>
        </div>
      ) : (
        <p className="text-xl self-center">
          You got {reward?.value} {coin?.coin.name}!
        </p>
      )}
    </div>
  );
}


export default PrizePage