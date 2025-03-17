import { FC, useCallback, useEffect, useState } from "react";
import { OpenDashFunPaymentEvent, OpenDashFunRechargeEvent } from "../Event/Events";
import { Button, Modal, Spinner, Subheadline, Text, Title } from "@telegram-apps/telegram-ui";
import { PaymentApi, PaymentData } from "@/utils/DashFunApi";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { useDashFunGame } from "../DashFun/DashFunGame";
import diamondIcon from "@/icons/dashfun-diamond4.png";
import { L, LangKeys, LV } from "../Language/Language";
import { useDashFunCoins } from "../DashFun/DashFunCoins";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Player } from "@lottiefiles/react-lottie-player";
import aniSuccess from "@/assets/animation/successful.json";
import aniFailed from "@/assets/animation/failed.json";
import { DashFunCoins } from "@/constats";

import "./DashFunPay.css";

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

    const evtListener = (paymentId: string, onResult: (success: boolean, msg: string) => void) => {
        if (user != null && game != null) {
            PaymentApi.getPayment(user.id, game.id, paymentId).then((res) => {
                setPaymentInfo({ payment: res, onResult });
                setShow(true);
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
                setTimeout(() => {
                    if (onResult) {
                        onResult(true, "Success");
                    }
                    clearPayment();
                    setShow(false);
                }, 2000);
            } catch (e) {
                setPaymentResult({ success: false, msg: e as string });
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
            className='max-w-screen-sm sm:mx-auto pay-modal'
            dismissible={false}

            open={show}
            style={{ backgroundColor: "transparent" }}
        >
            <div className="w-full flex items-center justify-center rounded-t-2xl " style={{ backgroundColor: "var(--tg-theme-secondary-bg-color)", paddingBottom: "var(--tgui--safe_area_inset_bottom)" }}>
                <div className="w-full flex flex-col items-center justify-center p-4">
                    {
                        game && <div className="w-full flex flex-col items-center justify-center gap-2">
                            <div className="w-full flex items-center justify-center relative">
                                <div className="w-28 rounded-full overflow-hidden">
                                    {<img src={game?.getIconUrl()} className="w-28 block object-cover rounded-full" />}
                                </div>
                                <div className="w-auto gap-[1px] px-2 border-2 absolute bottom-[-4px] flex flex-row items-center justify-center rounded-full"
                                    style={{
                                        borderColor: "var(--tg-theme-secondary-bg-color)",
                                        backgroundColor: "var(--tg-theme-button-color)",
                                        color: "var(--tg-theme-button-text-color)",
                                    }}
                                >
                                    <img src={diamondIcon} className="w-[18px]" />
                                    <Subheadline weight="1">{payment?.price}</Subheadline>
                                </div>
                            </div>
                            <Title weight="2"><L langKey={LangKeys.DashFunPay_ConfirmPurchase} /></Title>
                            <div className="flex flec-row items-center pr-4 rounded-full gap-2 justify-start" style={{ backgroundColor: "var(--tgui--section_bg_color)" }}>
                                {<img src={game?.getIconUrl()} className="w-10 h-full block object-cover rounded-full" />}
                                <Text weight="2">{game.name}</Text>
                            </div>
                        </div>
                    }

                    {payment == null ?
                        <Spinner size="m" /> :
                        <div className="w-full flex flex-col items-center justify-center pt-2 gap-2">
                            <div className="w-[80%] max-w-[340px]">
                                <Text>
                                    <LV langKey={LangKeys.DashFunPay_PurchaseTip} values={{
                                        title: "<b>" + (payment?.title || "") + "</b>",
                                        game: "<b>" + game?.name + "</b>",
                                        price: "<b>" + (payment?.price || 0).toString() + " Diamonds</b>",

                                    }} />&nbsp;
                                </Text>
                            </div>

                            {
                                paymentResult == null ? <>
                                    <Button size="l" loading={confirming} disabled={confirming} onClick={() => {
                                        confirmPayment();
                                    }}>
                                        <LV langKey={LangKeys.DashFunPay_ConfirmButton} values={{
                                            price: "<b>" + (payment?.price || 0).toString() + " Diamonds</b>",
                                        }} />
                                    </Button>
                                    <Button disabled={confirming} size="l" mode="plain" onClick={() => {
                                        setShow(false);
                                        if (onResult) {
                                            onResult(false, "User cancel");
                                        }
                                    }}>
                                        <L langKey={LangKeys.Common_Cancel} />
                                    </Button>
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
            <Text weight="2">{success ? "Purchase Successful" : msg}</Text>
        </div>
    </div>
}

export default DashFunPay;