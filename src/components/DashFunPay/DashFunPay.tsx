import { FC, useCallback, useEffect, useState } from "react";
import { OpenDashFunPaymentEvent, OpenDashFunRechargeEvent, UserPaymentEvent } from "../Event/Events";
import { Modal, Spinner } from "@telegram-apps/telegram-ui";
import { PaymentApi, PaymentData } from "@/utils/DashFunApi";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { useDashFunGame } from "../DashFun/DashFunGame";
import diamondIcon from "@/icons/dashfun-diamond4.png";
import { L, LangKeys, useLanguage } from "../Language/Language";
import { useDashFunCoins } from "../DashFun/DashFunCoins";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Player } from "@lottiefiles/react-lottie-player";
import aniSuccess from "@/assets/animation/successful.json";
import aniFailed from "@/assets/animation/failed.json";
import { DashFunCoins, formatNumber } from "@/constats";

import "./DashFunPay.css";
import { DFButton, DFLabel, DFText, MixedText } from "../controls";

/**
 * 付费组件，只能使用在游戏中，game-center中无法使用
 * @returns 
 */

const DashFunPay: FC = () => {
    const [show, setShow] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<{ payment: PaymentData, onResult: (success: boolean, msg: string) => void } | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [paymentResult, setPaymentResult] = useState<{ success: boolean; msg: string } | null>(null);

    const initDataRaw = useSignal(initData.raw) as string;
    const user = useDashFunUser();
    const game = useDashFunGame();
    const [_1, _2, updateCoins, getCoinInfo] = useDashFunCoins();
    const [get] = useLanguage();

    const evtListener = (paymentId: string, onResult: (success: boolean, msg: string) => void) => {
        if (user != null && game != null) {
            PaymentApi.getPayment(user.id, game.id, paymentId).then((res) => {
                setPaymentInfo({ payment: res, onResult });
                setShow(true);
                UserPaymentEvent.fire(res, "pending");
            })
        }
    }
    const clearPayment = useCallback(() => {
        setPaymentInfo(null);
        setPaymentResult(null);
        setConfirming(false);
    }, []);

    const confirmPayment = useCallback(async () => {
        const { payment, onResult } = paymentInfo || {};
        const userDiamond = getCoinInfo(DashFunCoins.DashFunDiamond, "name");
        if (user != null && game != null && userDiamond != null && payment != null) {

            if (userDiamond.userData.amount < payment.price) {
                clearPayment();
                setShow(false);
                if (onResult) {
                    onResult(false, "net enough balance");
                }
                //通知开启充值页面，以及最小充值金额
                OpenDashFunRechargeEvent.fire(payment.price - userDiamond.userData.amount);
                return;
            }
            setConfirming(true);
            try {
                await PaymentApi.confirmPayment(initDataRaw, payment.id);
                updateCoins && updateCoins(["DashFun"]);
                setPaymentResult({ success: true, msg: "Success" });
                UserPaymentEvent.fire(payment, "success");
                setTimeout(() => {
                    if (onResult) {
                        onResult(true, "Success");
                    }
                    clearPayment();
                    setShow(false);
                }, 2000);
            } catch (e) {
                setPaymentResult({ success: false, msg: e as string });
                UserPaymentEvent.fire(payment, "canceled");
                setTimeout(() => {
                    if (onResult) {
                        onResult(false, e as string);
                    }
                    clearPayment();
                    setShow(false);
                }, 5000);
            } finally {
                setConfirming(false);
            }
        }
    }, [user, game, paymentInfo]);

    useEffect(() => {
        OpenDashFunPaymentEvent.addListener(evtListener);
        return () => {
            OpenDashFunPaymentEvent.removeListener(evtListener);
        }
    }, [user, game]);

    const { payment, onResult } = paymentInfo || {};
    return <div id="dashfun-pay" className="fixed bottom-0 z-50" style={{ display: show ? "block" : "none" }}>
        <Modal
            className='max-w-screen-sm sm:mx-auto pay-modal '
            dismissible={false}
            open={show}
        >
            <div className="w-full flex items-center justify-center rounded-t-2xl bg-[#00254E] bg-gradient-to-bfrom-[#004275] to-[#00254E]" >
                <div className="w-full flex flex-col items-center justify-center p-4">
                    <div className="w-full flex flex-col items-start">
                        <DFLabel>
                            <MixedText template="Balance %icon%price" style={{ padding: "2px 15px 2px 15px" }} variables={{
                                icon: { type: "image", src: diamondIcon, style: { width: "20px", height: "20px", marginRight: 0, marginBottom: 2 } },
                                price: { type: "text", value: formatNumber(getCoinInfo(DashFunCoins.DashFunDiamond, "name")?.userData?.amount || 0), style: { fontWeight: "600", color: "white" } }
                            }} />
                        </DFLabel>
                    </div>
                    {
                        game && <div className="w-full flex flex-col items-center justify-center gap-2">
                            <div className="w-full flex items-center justify-center relative">
                                <div className="w-28 rounded-full overflow-hidden">
                                    {<img src={game?.getIconUrl()} className="w-28 block object-cover rounded-full" />}
                                </div>
                                <div className="w-auto gap-[1px] px-2 border-2 absolute bottom-[-4px] flex flex-row items-center justify-center rounded-full"
                                    style={{
                                        borderColor: "#00254E",
                                        backgroundColor: "#0072a5",
                                        color: "white",
                                    }}
                                >
                                    <img src={diamondIcon} className="w-[18px]" />
                                    <DFText weight="2" size="m">{payment?.price}</DFText>
                                </div>
                            </div>
                            <DFText weight="2" size="2xl"><L langKey={LangKeys.DashFunPay_ConfirmPurchase} /></DFText>
                            <DFLabel>
                                <div className="flex flec-row items-center pr-4 rounded-full gap-2 justify-start">
                                    {<img src={game?.getIconUrl()} className="w-10 h-full block object-cover rounded-full" />}
                                    <DFText size="lg" weight="2">{game.name}</DFText>
                                </div>
                            </DFLabel>
                        </div>
                    }

                    {payment == null ?
                        <Spinner size="m" /> :
                        <div className="w-full flex flex-col items-center justify-center pt-2 gap-4 ">
                            <div className="w-[80%] max-w-[340px]">
                                <DFText weight="1" size="m">
                                    <MixedText style={{ color: "#cccccc" }} template={get(LangKeys.DashFunPay_PurchaseTip) as string}
                                        variables={{
                                            title: { type: "text", value: payment?.title || "", style: { fontWeight: "600", color: "white" } },
                                            game: { type: "text", value: game?.name || "", style: { fontWeight: "600", color: "white" } },
                                            price: { type: "text", value: (payment?.price || 0).toString(), style: { fontWeight: "600", color: "white" } },
                                            icon: { type: "image", src: diamondIcon, style: { width: "20px", height: "20px", marginRight: 4, marginBottom: 4 } }
                                        }}
                                    />
                                </DFText>
                            </div>

                            {
                                paymentResult == null ? <>
                                    <DFButton size="l" loading={confirming} disabled={confirming} onClick={() => {
                                        confirmPayment();
                                    }}>
                                        <MixedText template={get(LangKeys.DashFunPay_ConfirmButton) as string}
                                            variables={{
                                                price: { type: "text", value: (payment?.price || 0).toString(), style: { fontWeight: "600", color: "white" } },
                                                icon: { type: "image", src: diamondIcon, style: { width: "20px", height: "20px", marginRight: 4, marginBottom: 4 } }
                                            }}
                                        />
                                    </DFButton>
                                    <DFButton disabled={confirming} size="m" mode="plain" onClick={() => {
                                        setShow(false);
                                        if (onResult) {
                                            onResult(false, "User cancel");
                                            UserPaymentEvent.fire(payment, "canceled");
                                        }
                                    }}>
                                        <L langKey={LangKeys.Common_Cancel} />
                                    </DFButton>
                                </> : <Result success={paymentResult.success} msg={paymentResult.msg} />
                            }
                        </div>}
                </div>
            </div>
        </Modal>
    </div>
}


const Result: FC<{ success: boolean, msg: string }> = ({ success, msg }) => {
    return <div className="w-full flex flex-col items-center justify-center p-2">
        <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={success ? aniSuccess : aniFailed}
            style={{ width: "100px" }}
        />
        <div className="w-full flex flex-col items-center justify-center p-2">
            <DFText size="m" weight="2">{success ? "Purchase Successful" : msg}</DFText>
        </div>
    </div>
}

export default DashFunPay;