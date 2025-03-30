import { Env, getEnv, PaymentData } from "@/utils/DashFunApi";
import { useEffect, useRef, useState } from "react";
import { DashFunUser } from "../DashFunData/UserData";
import { GameData } from "../DashFunData/GameData";
import { GameDataLoadedEvent, UnloadingEvent, UserEnterGameEvent, UserLoginEvent, UserPaymentEvent, UserRechargeEvent } from "../Event/Events";
import { ProfileType } from "../globalDefines";
import { createLogger } from "@/utils/createLogger";
const [logInfo] = createLogger("DF-TDAPP", {
    bgColor: '#228888',
    textColor: 'white',
    shouldLog() {
        return true;
    },
})

const TalkingDataLoader = () => {

    const [user, setUser] = useState<DashFunUser | null>(null)
    const [game, setGame] = useState<GameData | null>(null)

    const gameRef = useRef<GameData | null>(game);
    const userRef = useRef<DashFunUser | null>(user);

    const onUserLogin = (user: DashFunUser) => {
        setUser(user)
        logInfo(false, "User Login", user.id, user.userName)
        window.TDAPP?.login({
            profileId: user.id,
            profileType: ProfileType.Telegram,
            name: user.userName,
            gender: 0,
        })
    }

    const onGameDataLoaded = (game: GameData) => {
        setGame(game)
        logInfo(false, "Game Loaded Event", `[${game.id}]${game.name}`)
        window.TDAPP?.onEvent("游戏已载入", `[${game.id}]${game.name}`, { game_id: game.id, game_name: game.name })
    }

    const onUserEnterGame = (game: GameData) => {
        logInfo(false, "User Enter Game", `[${game.id}]${game.name}`)
        window.TDAPP?.onEvent("用户进入游戏", `[${game.id}]${game.name}`, { game_id: game.id, game_name: game.name })
    }

    const onUserPayment = (payment: PaymentData, status: "pending" | "success" | "canceled") => {
        const game = gameRef.current;
        logInfo(false, "User Payment", payment.id, status, game?.id, game?.name)

        if (status == "pending") {
            window.TDAPP?.onEvent("支付订单_创建", payment.id, { payment_id: payment.id, payment_price: payment.price, payment_currency: "Diamond", game_id: game?.id, game_name: game?.name })
        } else if (status == "success") {
            window.TDAPP?.onEvent("支付订单_成功", payment.id, { payment_id: payment.id, payment_price: payment.price, payment_currency: "Diamond", game_id: game?.id, game_name: game?.name })
        } else if (status == "canceled") {
            window.TDAPP?.onEvent("支付订单_取消", payment.id, { payment_id: payment.id, payment_price: payment.price, payment_currency: "Diamond", game_id: game?.id, game_name: game?.name })
        }
        if (window.TDAPP?.flush)
            window.TDAPP.flush();
    }

    const onUserRecharge = (orderId: string, amount: number, currencyType: string, status: "pending" | "success" | "canceled", payFrom: string) => {
        const game = gameRef.current;
        logInfo(false, "User Recharge", orderId, amount, currencyType, payFrom, status)
        if (status == "pending") {
            window.TDAPP?.onPlaceOrder({
                orderId, amount, currencyType
            });
            window.TDAPP?.onEvent("充值订单_创建", orderId, { order_id: orderId, amount, currencyType, game_id: game?.id || "DashFun", game_name: game?.name || "DashFun" })
        } else if (status == "success") {
            window.TDAPP?.onOrderPaySucc({
                orderId, amount, currencyType, paymentType: payFrom
            })
            window.TDAPP?.onEvent("充值订单_成功", orderId, { order_id: orderId, amount, currencyType, game_id: game?.id || "DashFun", game_name: game?.name || "DashFun" })
        } else if (status == "canceled") {
            window.TDAPP?.onCancelOrder({
                orderId, amount, currencyType
            });
            window.TDAPP?.onEvent("充值订单_取消", orderId, { order_id: orderId, amount, currencyType, game_id: game?.id || "DashFun", game_name: game?.name || "DashFun" })
        }
        if (window.TDAPP?.flush)
            window.TDAPP.flush();
    }

    const onUnload = () => {
        const game = gameRef.current;
        logInfo(false, "User Unload", game?.id, game?.name)
        window.TDAPP?.onEvent("用户离开游戏", game?.id, { game_id: game?.id, game_name: game?.name })
        if (window.TDAPP?.flush)
            window.TDAPP.flush();
    }


    useEffect(() => {
        const script = document.createElement('script');
        const setting = {
            src: 'https://jic.talkingdata.com/app/h5/v1',
            async: false,
            appId: "9F78CB43733543118A9F8D57BEE307CC",
            version: "1.0.0",
        }

        const getUrl = () => {
            return `${setting.src}?appid=${setting.appId}&vn=${setting.version}&vc=100 0`;
        }

        const env = getEnv();
        if (env == Env.Prod) {
            setting.src = "https://jic.talkingdata.com/app/h5/v1";
            setting.appId = "B629FAED680A46069666E6B86D17AE00";
        }

        script.src = getUrl();
        script.async = setting.async;

        document.body.appendChild(script);

        script.onload = () => {
            logInfo(false, "TalkingData SDK loaded", window.TDAPP);
        }
        UserLoginEvent.addListener(onUserLogin)
        GameDataLoadedEvent.addListener(onGameDataLoaded)
        UserEnterGameEvent.addListener(onUserEnterGame)
        UserPaymentEvent.addListener(onUserPayment)
        UserRechargeEvent.addListener(onUserRecharge)
        UnloadingEvent.addListener(onUnload);
        return () => {
            UserLoginEvent.removeListener(onUserLogin)
            GameDataLoadedEvent.removeListener(onGameDataLoaded)
            UserEnterGameEvent.removeListener(onUserEnterGame)
            UserPaymentEvent.removeListener(onUserPayment)
            UserRechargeEvent.removeListener(onUserRecharge)
            UnloadingEvent.removeListener(onUnload);
        }
    }, []);

    useEffect(() => {
        gameRef.current = game;
    }, [game])

    useEffect(() => {
        userRef.current = user;
    }, [user])

    return null;
}

export default TalkingDataLoader;