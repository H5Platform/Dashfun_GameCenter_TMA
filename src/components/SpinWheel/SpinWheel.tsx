import { useState } from "react";
import "./spinwheel.css";
import PrizePage from "./PrizePage";
// import { useDashFunSpinWheel } from "../DashFun/DashFunSpinWheel";

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 当前旋转角度
  const [prize, setPrize] = useState<number | null>(null); // 当前的得分

  // const [spinWheel, spin, claim] = useDashFunSpinWheel();
  // console.log("======spinWheel:", spinWheel, spin);

  // 定义转盘分区，每个分区对应的得分
  const scores = [100, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const numSegments = scores.length;
  const segmentAngle = 360 / numSegments; // 每个分区的角度是 36°

  // 模拟从服务器获取得分
  const getPrizeFromServer = async (): Promise<number> => {
    return new Promise((resolve) => {
      const randomPrizeIndex = Math.floor(Math.random() * numSegments);
      setTimeout(() => resolve(scores[randomPrizeIndex]), 500); // 模拟网络延迟
    });
  };

  const handleSpin = async () => {
    if (isSpinning) return; // 防止多次点击
    setIsSpinning(true);

    // 每次重新开始旋转时，将当前角度重置为 0
    setRotationAngle(0);

    // 从服务器获取得分
    const prizeScore = await getPrizeFromServer();

    // 根据得分找到对应的奖品索引
    const prizeIndex = scores.indexOf(prizeScore);

    // 计算分区中心，确保转盘停在分区正中间
    const fullRotations = 5 * 360; // 至少旋转5圈
    const finalSegmentAngle = prizeIndex * segmentAngle; // 得分对应的分区角度

    // 计算分区的中心位置 (加上分区的一半 18度)
    const targetAngle =
      fullRotations + (360 - finalSegmentAngle) + segmentAngle / 2;

    const spinDuration = 3000; // 动画时长3秒

    animateSpin(targetAngle, spinDuration, () => {
      setPrize(prizeScore); // 显示得分
      setIsSpinning(false); // 允许再次旋转
    });
  };

  // 旋转动画函数，逐渐减速停止
  const animateSpin = (
    targetAngle: number,
    duration: number,
    onComplete: () => void
  ) => {
    const startTime = performance.now();
    let currentAngle = rotationAngle; // 从当前角度开始旋转

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
    <div className="h-screen flex flex-wrap items-center content-evenly">
      {prize ? (
        <PrizePage prize={prize} />
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

            {/* 显示得分 */}
            {/* {prize !== null && <div className="prize-result">You won: {prize}!</div>} */}
          </div>
          {/* 旋转按钮 */}
          <button
            className={`${
              isSpinning ? "bg-gray-500" : "bg-blue-500"
            } w-full text-xl font-bold text-white py-2 rounded-md`}
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? "SPINNING..." : "SPIN"}
          </button>
        </>
      )}
    </div>
  );
}
