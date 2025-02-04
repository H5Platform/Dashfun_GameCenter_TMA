import {
	$debug,
	backButton,
	initData,
	init as initSDK,
	mainButton,
	miniApp,
	swipeBehavior,
	themeParams,
	viewport
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(debug: boolean): Promise<void> {
	// Set @telegram-apps/sdk-react debug mode.
	$debug.set(debug);

	// Initialize special event handlers for Telegram Desktop, Android, iOS, etc. Also, configure
	// the package.
	initSDK();

	// Mount all components used in the project.
	backButton.isSupported() && backButton.mount();
	mainButton.mount();
	miniApp.mount();
	themeParams.mount();
	miniApp.bindCssVars();
	themeParams.bindCssVars();
	// miniApp.setHeaderColor("#eab308")
	swipeBehavior.isSupported() && swipeBehavior.mount();
	initData.restore();

	try {
		await viewport.mount();
	} catch (e: any) {
		console.error('Something went wrong mounting the viewport', e);
	}
	viewport.requestFullscreen.ifAvailable();
	viewport.bindCssVars();

	// void viewport.mount().then(() => {
	// 	// Define components-related CSS variables.
	// 	viewport.bindCssVars();
	// 	swipeBehavior.disableVertical();
	// 	// console.log("fullscreen:", requestFullscreen.isAvailable())
	// 	// if (requestFullscreen.isAvailable()) {
	// 	// 	requestFullscreen.ifAvailable()
	// 	// } else 
	// 	// if (disableVerticalSwipes.isAvailable()) {
	// 	// 	disableVerticalSwipes()
	// 	// }
	// 	// if (expandViewport.isAvailable()) {
	// 	// 	expandViewport();
	// 	// }
	// }).catch((e: any) => {
	// 	console.error('Something went wrong mounting the viewport', e);
	// });


	// Add Eruda if needed.
	debug && import('eruda')
		.then((lib) => lib.default.init())
		.catch(console.error);
}