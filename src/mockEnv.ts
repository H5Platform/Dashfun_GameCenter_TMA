import { mockTelegramEnv, isTMA, parseInitData } from '@telegram-apps/sdk-react';

// It is important, to mock the environment only for development purposes. When building the
// application, import.meta.env.DEV will become false, and the code inside will be tree-shaken,
// so you will not see it in your final bundle.
if (import.meta.env.DEV) {
	(() => {
		let shouldMock;
		const MOCK_KEY = '____mocked';

		// We don't mock if we are already in a mini app.
		if (isTMA('simple')) {
			// We could previously mock the environment.
			// In case we did, we should do it again.
			// The reason is the page could be reloaded, and we should apply mock again, because
			// mocking also enables modifying the window object.
			shouldMock = !!sessionStorage.getItem(MOCK_KEY);
		} else {
			shouldMock = true;
		}

		if (!shouldMock) {
			return;
		}

		// const initDataRaw = new URLSearchParams([
		// 	['user', JSON.stringify({
		// 		id: 99281932,
		// 		first_name: 'Andrew',
		// 		last_name: 'Rogue',
		// 		username: 'rogue',
		// 		language_code: 'en',
		// 		is_premium: true,
		// 		allows_write_to_pm: true,
		// 	})],
		// 	['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
		// 	['auth_date', '1716922846'],
		// 	['start_param', 'debug'],
		// 	['chat_type', 'sender'],
		// 	['chat_instance', '8428209589180549439'],
		// ]).toString();

    const initDataRaw = "query_id=AAGuFCQDAQAAAK4UJAPHYlhd&user=%7B%22id%22%3A2200179886%2C%22first_name%22%3A%22Marco%22%2C%22last_name%22%3A%22Test%22%2C%22username%22%3A%22Marco_web3%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Fa-ttgme.stel.com%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FUyoEyL4xrB_4jYbtDAKsRlU3-VHl9vlJ_ESwtdo9ztBcHXdXsAzLHk1biir38TJ-.svg%22%7D&auth_date=1738643830&signature=b9BaT5t8w5bR4b0S509qY1VIsmk20aymkhP2CfRv-r7M-G4Injb0iELE4licSA9F-nFaYPYkFFZQl-3IPf4jDg&hash=031c3c0040a6d79f979fab7c4c1db26fa7f67c9edc012fdfabcc64b8a14012e3"
		mockTelegramEnv({
			themeParams: {
				accentTextColor: '#3e88f7',
				bgColor: '#000000',
				buttonColor: '#3e88f7',
				buttonTextColor: '#ffffff',
				destructiveTextColor: '#eb5545',
				headerBgColor: '#1a1a1a', 
				hintColor: '#98989e',
				linkColor: '#3e88f7',
				secondaryBgColor: '#1c1c1d',
				sectionBgColor: '#2c2c2c',
				sectionHeaderTextColor: '#8d8e93',
				subtitleTextColor: '#98989e',
				textColor: '#ffffff',
			},
			initData: parseInitData(initDataRaw),
			initDataRaw,
			version: '8',
			platform: 'tdesktop',
		});
		sessionStorage.setItem(MOCK_KEY, '1');

		console.info(
			'⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
		);
	})();
}