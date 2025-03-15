import { FC, useEffect, useRef, useState } from "react";
import diamondIcon from "@/icons/dashfun-diamond4.png";
import starIcon from "@/icons/star-icon.png";
import { Button, Caption, Cell, Spinner, Text, Title } from "@telegram-apps/telegram-ui";
import { RechargeApi, RechargeLink } from "@/utils/DashFunApi";
import { initData, retrieveLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { RechargeOrderStatus, RechargePriceType, toCurrency } from "@/constats";
import { motion } from "framer-motion";
import Section from "../Section/Section";
import { useDashFunCoins } from "../DashFun/DashFunCoins";
import { L, LangKeys } from "../Language/Language";
import { useDashFunUser } from "../DashFun/DashFunUser";
import { orderSaveKey } from "@/utils/Utils";

import aniSuccess from "@/assets/animation/successful.json";
import aniFailed from "@/assets/animation/failed.json";

import "./DashFunRecharge.css"
import { Player } from "@lottiefiles/react-lottie-player";
import CountUp from "../CountUp/CountUp";

type OrderInfo = {
    orderId: string,
    optionIndex: number,
}

const priceToString = (price: number, priceType: number) => {
    if (priceType == RechargePriceType.TGSTAR) {
        return <div className="flex items-center justify-center flex-row gap-1"><img src={starIcon} className="w-4" />{toCurrency(price) + " Stars"} </div>
    } else {
        return <p>{"$" + toCurrency(price / 100)}</p>;
    }
}

const calcFinalPrice = (price: number, off: number) => {
    return off > 0 ? price * ((1000 - off) / 1000) : price;
}

const payingOrder = (userId: string): OrderInfo => {
    if (userId == "") return { orderId: "", optionIndex: -1 };
    const str = localStorage.getItem(orderSaveKey(userId)) || "";
    if (str == "") {
        return {
            orderId: "",
            optionIndex: -1
        }
    } else {
        const order = JSON.parse(str) as OrderInfo;
        return order;
    }
}

const saveOrder = (userId: string, orderId: string, optionIndex: number): OrderInfo => {
    if (userId == "") return { orderId: "", optionIndex: -1 };
    const order: OrderInfo = {
        orderId: orderId,
        optionIndex: optionIndex
    }
    localStorage.setItem(orderSaveKey(userId), JSON.stringify(order));
    return order;
}

const clearSavedOrder = (userId: string) => {
    if (userId == "") return;
    localStorage.removeItem(orderSaveKey(userId));
}

type RechargeOption = {
    diamond: number,
    price: number,
    price_off: number
}

const DashFunRecharge: FC = () => {
    const [priceType, setPriceType] = useState(1);
    const [options, setOptions] = useState<RechargeOption[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    //当前选择的option的index，-1表示没选
    const [selected, setSelected] = useState<number>(-1);
    const initDataRaw = useSignal(initData.raw)
    const user = useDashFunUser();
    const [purchasedOrder, setPurchasedOrder] = useState<any>(null);

    const [_1, _2, updateCoins, getCoinInfo] = useDashFunCoins();

    const getRechargeOptions = async () => {
        // Fetch recharge options
        const result = await RechargeApi.getOptions(initDataRaw as string);
        setPriceType(result.price_type);
        setOptions(result.options);

        const order = payingOrder(user?.id || "");
        if (order.orderId != "" && order.optionIndex >= 0) {
            checkSavedOrder(order);
        }
    }

    const checkSavedOrder = async (order: OrderInfo) => {
        setIsChecking(true);
        try {
            //const result = await RechargeApi.getOrder(order.orderId)
            //if (result.status <= RechargeOrderStatus.Paid) {
            setSelected(order.optionIndex);
            // } else {
            //     clearSavedOrder(user?.id || "");
            // }
        } finally {
            setIsChecking(false);
        }
    }

    useEffect(() => {
        getRechargeOptions();
    }, [])

    const diamondCoin = getCoinInfo("DashFunDiamond", "name");

    const headerHeight = 200;
    return <div id="recharge" className="w-full h-full items-center justify-start flex flex-col gap-2">
        <div className="fixed flex flex-col items-center justify-center gap-2 w-full z-10 backdrop-blur-md"
            style={{ height: headerHeight, minHeight: headerHeight }}>
            <img src={diamondIcon} className='h-[100px] object-contain py-2' />
            <div className="px-4 py-2 rounded-full" style={{ backgroundColor: "var(--tgui--section_bg_color)" }}>
                <Text weight="2"><L langKey={LangKeys.Common_Balance} />:&nbsp;
                    {
                        //toCurrency(diamondCoin?.userData.amount || 0, 0)
                    }
                    <CountUp
                        from={diamondCoin?.userData.amount || 0}
                        to={(diamondCoin?.userData.amount || 0) +
                            (purchasedOrder && purchasedOrder.status == RechargeOrderStatus.Completed ? purchasedOrder.diamond : 0)}
                        separator=","
                        duration={1}
                    />
                </Text>
            </div>
            <Title><L langKey={LangKeys.Common_Get} /> <L langKey={LangKeys.Common_DashFunDiamond} /></Title>
        </div>
        {options.length == 0 || isChecking ? <div className="w-full h-full items-center justify-center flex"
            style={{ paddingTop: headerHeight }}>
            <Spinner size={"l"} /></div> : null}

        <div className="flex w-full min-w-full overflow-x-hidden">
            <motion.div className="flex w-full h-full"
                animate={{ x: selected >= 0 ? "-100%" : "0" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <div className="w-full min-w-full h-full p-4 overflow-y-auto "
                    style={{ paddingTop: headerHeight }} >
                    <RechargeList options={options} priceType={priceType} onClick={(_, index) => {
                        setSelected(index);
                    }} />
                </div>
                <div className="flex w-full min-w-full h-full p-4"
                    style={{ paddingTop: headerHeight }}>
                    <RechargeSelected optionIndex={selected}
                        option={selected >= 0 && options.length > 0 ? options[selected] : undefined}
                        priceType={priceType}
                        onBack={() => {
                            setSelected(-1);
                            updateCoins && updateCoins(["DashFun"]).then(() => {
                                setPurchasedOrder(null);
                            });
                        }}
                        onPurchase={(rechargeOrder) => {
                            setPurchasedOrder(rechargeOrder);
                        }}
                    />
                </div>
            </motion.div>
        </div>
    </div>
}

const RechargeSelected: FC<{
    optionIndex: number, option?: RechargeOption, priceType: number, onBack?: () => void, onPurchase?: (rechargeOrder: any) => void
}> = ({ optionIndex, option, priceType, onBack, onPurchase }) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderInfo>();
    const initDataRaw = useSignal(initData.raw) as string
    const platform = retrieveLaunchParams().platform;
    const user = useDashFunUser();
    const [rechargeOrder, setRechargeOrder] = useState(null);

    const orderRef = useRef(order);

    const checkOrderStatus = async () => {
        const order = orderRef.current;
        console.log("checking order status", order);
        if (order && order.orderId != "") {
            const result = await RechargeApi.getOrder(order?.orderId)
            console.log(result);
            if (result.status == RechargeOrderStatus.Completed
                || result.status == RechargeOrderStatus.Failed
                || result.status == RechargeOrderStatus.Canceled
            ) {
                setRechargeOrder(result);
                onPurchase && onPurchase(result);
                setTimeout(() => {
                    setLoading(false);
                    clearSavedOrder(user?.id || "");
                    setOrder(undefined);
                    setRechargeOrder(null);
                    onBack && onBack();
                }, 8000);
            }
        }
    }

    useEffect(() => {
        orderRef.current = order;
    }, [order])

    useEffect(() => {
        const order = payingOrder(user?.id || "");
        if (order.orderId != "" && order.optionIndex >= 0) {
            setLoading(true);
            setOrder(order);
        }
        checkOrderStatus();
        const interval = setInterval(() => {
            checkOrderStatus();
        }, 20000);
        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        //rechargeOrder状态变化
    }, [rechargeOrder])

    const requestOrder = async () => {
        setLoading(true);
        try {
            const result = await RechargeApi.requestOrder(initDataRaw, platform, optionIndex);
            //保存正在进行的订单到本地
            const order = saveOrder(user?.id || "", result, optionIndex);
            setOrder(order);
        } catch (e) {
            console.error(e);
        } finally {
            //setLoading(false);
        }
    }

    const cancelOrder = async () => {
        if (order && order.orderId != "") {
            RechargeApi.cancelOrder(initDataRaw, order?.orderId);
        }
        setLoading(false);
        clearSavedOrder(user?.id || "");
        setOrder(undefined);
        if (onBack) {
            onBack();
        }
    }

    const finalPrice = calcFinalPrice(option?.price || 0, option?.price_off || 0);

    const rechargeLink = RechargeLink.orderLink(order?.orderId || "");

    return <div className="w-full h-full items-center justify-start flex flex-col gap-2 pt-4">
        <Section >
            <div className="w-full flex flex-row items-center justify-center py-2">
                <img src={diamondIcon} className="w-8" />
                <div className="px-2 flex flex-col items-start justify-center">
                    <div className="w-auto">
                        <L langKey={LangKeys.Common_Buy} />&nbsp;
                        <Text weight="2">{toCurrency(option?.diamond || 0, 0)}</Text>&nbsp;
                        <L langKey={LangKeys.Common_DashFunDiamond} />
                    </div>
                    <p className="text-sm" style={{ color: "var(--tgui--hint_color)" }}>
                        <L langKey={LangKeys.Recharge_BuyDiamondSubTitle} />
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-row items-center justify-center py-2">
                <Text weight="2">USD</Text>
                <Text weight="2">
                    {priceToString(finalPrice, priceType)}
                </Text>
            </div>

            {
                rechargeOrder == null && order != null && order.orderId != "" && order.optionIndex >= 0 &&
                <div className="w-full flex flex-col items-center justify-center p-2">
                    <Caption weight="2"><L langKey={LangKeys.Recharge_Purchase_Link_Tip} /></Caption>
                    <a href={rechargeLink} target="_blank">
                        <Caption style={{ color: "var(--tg-theme-link-color)" }}>{rechargeLink}</Caption>
                    </a>
                </div>
            }
            {
                rechargeOrder == null && <div className="w-full flex items-center justify-center py-3">
                    <Button size="m"
                        loading={loading}
                        disabled={loading}
                        onClick={() => {
                            requestOrder();
                        }}
                    ><L langKey={LangKeys.Common_Purchase} /></Button>
                    <Button onClick={() => cancelOrder()} mode="plain"><L langKey={LangKeys.Common_Cancel} /></Button>
                </div>
            }
            {
                rechargeOrder != null && <RechargeResult rechargeOrder={rechargeOrder} />
            }

        </Section>

    </div >
}

const RechargeResult: FC<{ rechargeOrder: any }> = ({ rechargeOrder }) => {
    return <div className="w-full h-full items-center justify-start flex flex-col gap-2 py-2">
        <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={rechargeOrder.status == RechargeOrderStatus.Completed ? aniSuccess : aniFailed}
            style={{ width: "150px" }}
        />
        <div className="w-full flex flex-col items-center justify-center p-2">
            <Caption weight="2">{rechargeOrder.status == RechargeOrderStatus.Completed ? "Purchase Successful" : "Purchase Failed"}</Caption>
        </div>
    </div>
}

const RechargeList: FC<{
    options: RechargeOption[], priceType: number,
    onClick?: (option: RechargeOption, index: number) => void
}> = ({ options, priceType, onClick }) => {
    return <div className="w-full flex flex-col gap-3" >
        {
            options.map((option, index) => {
                return <div className="w-full" key={index}>
                    <RechargeItem option={option} priceType={priceType} onClick={() => {
                        if (onClick) {
                            onClick(option, index);
                        }
                    }} />
                </div>
            })
        }
    </div>
}

/**
 * off 折扣, 10 = 1% off
 * @param param0 
 * @returns 
 */
const RechargeItem: FC<{ option: RechargeOption, priceType: number, onClick: () => void }> = ({ option, priceType, onClick }) => {
    const { diamond, price, price_off: off } = option;
    const finalPrice = calcFinalPrice(price, off);

    return <Cell className="w-full rounded-2xl relative"
        style={{ backgroundColor: "var(--tgui--section_bg_color)" }}
        after={priceToString(finalPrice, priceType)}
        onClick={onClick}>
        {off >= 10 && <div className="absolute w-full h-full top-0 left-0 overflow-clip rounded-2xl">
            <div className="absolute px-3 pb-1 left-[-42px] top-[-10px] -rotate-45 flex flex-col items-center justify-end h-full font-semibold rounded-l-2xl w-[120px] bg-opacity-70 bg-red-400 text-white text-xs ">
                <p>{off / 10}%</p>
                OFF
            </div>
        </div>}
        <div className="w-full flex flex-row items-center pl-[30px]">
            <img src={diamondIcon} className="w-5" />
            <div className="pr-2 text-right font-semibold">{toCurrency(diamond, 0)}</div>
        </div>
    </Cell>
}

// /**
//  * 显示指定数量的层叠diamond图标
//  * @param param0
//  * @returns
//  */
// const Diamonds: FC<{ count: number, size: number, width: number }> = ({count, size, width}) => {
//     return <div className="relative h-full flex flex-row items-center"
//         style={{ width: width }}>
//         {
//             Array.from({ length: count }).map((_, index) => {
//                 return <img key={index} src={diamondIcon} className="absolute" style={{
//                     width: size,
//                     right: index * 4
//                 }} />
//             })
//         }
//     </div>
// }

export default DashFunRecharge;