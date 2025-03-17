/**
 * 非telegram内置浏览器中打开telegram miniapp的代理组件，接收telegram事件并做出回应
 */

import { isInTelegram } from "@/utils/Utils";

declare global {
    interface Window {
        TelegramWebviewProxy?: TelegramWebviewProxy;
    }
}

class TelegramWebviewProxy {
    postEvent(...args: unknown[]) {
        console.log("TelegramWebviewProxy postEvent----", args);
        return;
    }
}

const initProxy = () => {
    if (!isInTelegram()) {
        window.TelegramWebviewProxy = new TelegramWebviewProxy();
        console.log("TelegramWebviewProxy init");
    }
}

export default initProxy