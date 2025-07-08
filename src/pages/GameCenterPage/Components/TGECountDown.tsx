import { DFCell, DFText, DFLabel, DFButton } from "@/components/controls";
import { DFInfoLabel } from "@/components/controls/Label";
import { useAirdropData } from "@/components/Wallet/airdrop_contract";
import { FC, useState, useEffect } from "react";
import kcLogo from "@/icons/kc-logo.svg";
import { useNavigate } from "react-router-dom";
const kc_signup_url = "https://www.kucoin.com/ucenter/signup"

export const TGECountDown: FC<{ showCheckBtn?: boolean }> = ({ showCheckBtn = false }) => {
	const airdropData = useAirdropData();
	const [countdown, setCountdown] = useState<number>(0);
	const [type, setType] = useState("tge")
	const nav = useNavigate();
	useEffect(() => {
		if (airdropData == null) {
			setCountdown(0);
			return;
		}

		const startTime = airdropData.start_time * 1000;
		const claimTime = (airdropData.start_time + airdropData.claim_time) * 1000;

		let targetDate = startTime;
		if (Date.now() > startTime) {
			targetDate = claimTime;
			setType("airdrop");
		}

		const interval = setInterval(() => {
			const now = Date.now();
			const distance = targetDate - now;
			if (distance < 0) {
				clearInterval(interval);
				setCountdown(0);
			} else {
				setCountdown(Math.floor(distance / 1000));
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [airdropData]);

	const days = Math.floor(countdown / (24 * 3600));
	const hours = Math.floor((countdown % (24 * 3600)) / 3600);
	const minutes = Math.floor((countdown % 3600) / 60);
	const seconds = countdown % 60;

	return (countdown <= 0 ? <></> : <div className="w-full flex flex-col gap-4">
		{(type == "airdrop" && <DFCell mode="primary" className="w-full">
			<div className="w-full flex flex-col items-center justify-center gap-2 py-2 px-4">
				<DFText weight="3" size="xl" className="w-full text-center">🎉 TGE is live!</DFText>
				<div className="w-full flex flex-row items-center justify-center gap-2">
					<DFText weight="3" size="m">🚀 DFUN is now trading on </DFText>
					<img src={kcLogo} className="h-6 cursor-pointer" onClick={() => {
						window.open(kc_signup_url, "_blank");
					}} />
				</div>
			</div>
		</DFCell>)}
		<DFLabel rounded="lg">
			<div className="w-full flex flex-col items-center justify-center gap-2 py-2 px-4 ">
				<DFText weight="3" size="xl" className="w-full text-center">{
					type == "tge" ? "TGE starts in" : "Airdrop starts in"
				}</DFText>
				<DFText weight="3" size="3xl">{days}d {hours}h {minutes}m {seconds}s</DFText>
				{(showCheckBtn && <DFButton size="m" onClick={() => {
					nav("/game-center/wallet")
				}}>
					Check It Out
				</DFButton>)}
			</div>
		</DFLabel>

		{
			(type == "tge" && <div className="w-full">
				<DFInfoLabel rounded="lg">
					<DFText size="m" weight="1" className="px-4 py-2 w-full text-center">
						Airdrop starts in 12 hours after TGE.
					</DFText>
				</DFInfoLabel>
			</div>)
		}

	</div>
	)
}