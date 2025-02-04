import { useNavigate } from 'react-router-dom';
import { backButton, useSignal, viewport } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true, allowYScroll = false, includeContentSafeArea = true }: PropsWithChildren<{
	/**
	 * True if it is allowed to go back from this page.
	 */
	back?: boolean

	includeContentSafeArea?: boolean
	/**
	 * True if it is allowed to scroll on this page
	 */
	allowYScroll?: boolean
}>) {
	const navigate = useNavigate();
	const top = useSignal(viewport.safeAreaInsetTop);
	const bottom = useSignal(viewport.safeAreaInsetBottom);
	const contentTop = useSignal(viewport.contentSafeAreaInsetTop)
	const contentBottom = useSignal(viewport.contentSafeAreaInsetBottom)

	const pt = includeContentSafeArea ? top + contentTop : top;
	const pb = includeContentSafeArea ? bottom + contentBottom : bottom;

	useEffect(() => {
		if (back) {
			backButton.show();
			return backButton.onClick(() => {
				navigate(-1);
			});
		}
		backButton.hide();
	}, [back]);

	return <div className={`w-full h-full min-h-full`} style={{ paddingTop: pt + "px", paddingBottom: pb + "px" }}>
		<div id="page" className={`w-full h-full ${allowYScroll ? "overflow-y-auto" : ""}`}>{children}</div>
	</div>
}