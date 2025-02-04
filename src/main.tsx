import { init } from '@/init.ts';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { createRoot } from 'react-dom/client';
import { Root } from './components/Root.tsx';
import './index.css';

import "./mockEnv.ts";

init(retrieveLaunchParams().startParam === 'debug' || true)
postEvent("web_app_expand");


createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Root />
	// </StrictMode>,
)