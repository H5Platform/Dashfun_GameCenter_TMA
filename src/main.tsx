import { init } from '@/init.ts';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { createRoot } from 'react-dom/client';
import { Root } from './components/Root.tsx';
import './index.css';
import { Env, getEnv } from './utils/DashFunApi.tsx';
import DBMgr from './components/DBMgr/DBMgr.ts';
import GameSaveMgr from './components/GameSaveMgr/GameSaveMgr.ts';
import "./mockEnv.ts";
import makeMockTgEnv from './mockEnv.ts';

/**
 * tgbot绑定miniapp链接时，不需要entry/tg的路径，只需要router中的路径即可,如/game, /game-center
 */
const path = window.location.href;
const idx = path.indexOf("/entry/")
if (idx > 0) {
	//从entry进入，根据参数生成不同环境
	let params = path.slice(idx + 1).split("/");
	if (params[0] == "entry") {
		const channel = params[1];
		if (channel == "test" && getEnv() != Env.Prod) {
			//生成测试环境的数据
			makeMockTgEnv();
		}
		if (channel == "tg") {
			//tg环境自动注入
		}
	}
} else {
	//从localStroage中获取环境，如果获取不到默认就是tg环境
	const channel = localStorage.getItem("DashFun-LoginChannel-" + getEnv());
	if (channel == "test" && getEnv() != Env.Prod) {
		//生成测试环境的数据
		makeMockTgEnv();
	}
}

console.log("Platform:", retrieveLaunchParams().platform);

init(retrieveLaunchParams().startParam === 'debug' || getEnv() == Env.Dev, retrieveLaunchParams().platform)

postEvent("web_app_expand");
DBMgr.getInstance().openDB();
GameSaveMgr.getInstance();

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Root />
	// </StrictMode>,
)