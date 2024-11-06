import { useState } from "react";
import { useDashFunSpinWheel } from "../DashFun/DashFunSpinWheel";
import { SpinWheelConstants } from "../DashFunData/SpinWheelData";

export default function PrizePage() {
  const [loading, setLoading] = useState(false);

  const [spinWheel, _, claim] = useDashFunSpinWheel();

  const reward = spinWheel?.rewards[spinWheel?.rewardIndex];

  const spinWheelStatus = spinWheel?.status;

  const onClaim = async () => {
    setLoading(true);
    try {
      const claimRes = await claim();
      console.log("claim res", claimRes);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-wrap justify-center items-center h-screen max-h-[100vh] w-full">
      <img src="/img/dashfun-point-icon.png" alt="prize" className="self-end" />
      {spinWheelStatus == SpinWheelConstants.Status.CanClaim ? (
        <div className="self-start w-full">
          <p className="text-xl text-center">You won {reward?.value}!</p>
          <button
            className={`${
              loading ? "bg-gray-500" : "bg-blue-500"
            } w-full text-xl font-bold text-white py-2 rounded-md block`}
            onClick={onClaim}
            disabled={loading}
          >
            {loading ? "CLAIMING..." : "CLAIM"}
          </button>
        </div>
      ) : (
        <p className="text-xl self-start">
          You have successfully claimed {reward?.value}!
        </p>
      )}
    </div>
  );
}
