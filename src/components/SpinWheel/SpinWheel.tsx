import { useEffect, useState } from "react";
import "./spinwheel.css";
import PrizePage from "./PrizePage";
import { useDashFunSpinWheel } from "../DashFun/DashFunSpinWheel";
import { SpinWheelConstants } from "../DashFunData/SpinWheelData";

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 当前旋转角度

  const [canClaim, setCanClaim] = useState<boolean>(false);

  const [spinWheel, spin] = useDashFunSpinWheel();

  useEffect(() => {
    if (spinWheel?.canClaim()) {
      setCanClaim(true);
    }
  }, [spinWheel]);

  // console.log("can claim: ", canClaim);

  // console.log("======spin wheel", spinWheel);

  const segmentAngle = 360 / 10; // 每个分区的角度是 36°

  const handleSpin = async () => {
    if (isSpinning) return; // 防止多次点击
    setIsSpinning(true);

    // 每次重新开始旋转时，将当前角度重置为 0
    setRotationAngle(0);

    // 从服务器获取得分
    const spinRes = await spin();
    if (spinRes) {
      const { rewardIndex } = spinRes;

      // 计算分区中心，确保转盘停在分区正中间
      const fullRotations = 5 * 360; // 至少旋转5圈
      // const finalSegmentAngle = prizeIndex * segmentAngle; // 得分对应的分区角度
      const finalSegmentAngle = rewardIndex * segmentAngle; // 得分对应的分区角度

      // 计算分区的中心位置 (加上分区的一半 18度)
      const targetAngle =
        fullRotations + (360 - finalSegmentAngle - segmentAngle / 2);

      const spinDuration = 3000; // 动画时长3秒

      animateSpin(targetAngle, spinDuration, () => {
        setCanClaim(true);
        setIsSpinning(false); // 允许再次旋转
      });
    }
  };

  // 旋转动画函数，逐渐减速停止
  const animateSpin = (
    targetAngle: number,
    duration: number,
    onComplete: () => void
  ) => {
    const startTime = performance.now();
    const currentAngle = rotationAngle; // 从当前角度开始旋转

    const step = (timestamp: number) => {
      const elapsedTime = timestamp - startTime;

      if (elapsedTime >= duration) {
        setRotationAngle(targetAngle); // 动画结束，设置最终角度
        setTimeout(() => onComplete(), 3000); // 等待 3000ms 显示得分
        // onComplete();
      } else {
        const progress = elapsedTime / duration;
        const easedProgress = easeOutQuad(progress); // 使用缓动函数减速
        const currentSpinAngle =
          currentAngle + easedProgress * (targetAngle - currentAngle);
        setRotationAngle(currentSpinAngle); // 更新当前旋转角度
        requestAnimationFrame(step); // 继续动画
      }
    };
    requestAnimationFrame(step); // 开始动画
  };

  // 缓动函数，模拟减速效果
  const easeOutQuad = (t: number): number => t * (2 - t);

  return (
    <div className="h-screen max-h-screen flex flex-wrap items-center content-evenly">
      {canClaim && !isSpinning ? (
        <PrizePage />
      ) : (
        <>
          <div className="spin-wheel-container">
            <div className="wheelRing">
              <img src="/img/wheel_ring.png" alt="Spin Wheel" />
            </div>
            {/* 旋转的转盘 */}
            <div
              className="wheel"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <img src="/img/wheel.png" alt="Spin Wheel" />
            </div>

            {/* 固定的指针 */}
            <div className="pointer">
              <img src="/img/wheel_pointer.png" alt="Pointer" />
            </div>
          </div>

          <button
            className={`${
              isSpinning ||
              spinWheel?.status == SpinWheelConstants.Status.Claimed
                ? "bg-gray-500"
                : "bg-blue-500"
            } w-full text-xl font-bold text-white py-2 rounded-md`}
            onClick={handleSpin}
            disabled={
              isSpinning ||
              spinWheel?.status == SpinWheelConstants.Status.Claimed
            }
          >
            {isSpinning ? "SPINNING..." : "SPIN"}
          </button>
        </>
      )}
    </div>
  );
}
