import { init } from '@/init.ts';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { createRoot } from 'react-dom/client';
import { Root } from './components/Root.tsx';
import './index.css';

import "./mockEnv.ts";
import { Env, getEnv } from './utils/DashFunApi.tsx';
import DBMgr from './components/DBMgr/DBMgr.ts';
import GameSaveMgr from './components/GameSaveMgr/GameSaveMgr.ts';

init(retrieveLaunchParams().startParam === 'debug' || getEnv() == Env.Dev)
postEvent("web_app_expand");
DBMgr.getInstance().openDB();
GameSaveMgr.getInstance();

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Root />
	// </StrictMode>,
)