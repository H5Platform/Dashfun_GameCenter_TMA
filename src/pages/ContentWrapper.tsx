import { useSignal, viewport } from "@telegram-apps/sdk-react";
import { PropsWithChildren } from "react";

export const ContentWrapper = ({ children, includeContentSafeArea = true, paddingTopAdd, paddingBottomAdd, className }: PropsWithChildren<{ includeContentSafeArea?: boolean, paddingTopAdd?: number, paddingBottomAdd?: number, className?: string }>) => {
	const state = useSignal(viewport.state);
	const { contentSafeAreaInsets, safeAreaInsets } = state;

	const pt = (includeContentSafeArea ? safeAreaInsets.top + contentSafeAreaInsets.top : safeAreaInsets.top) + (paddingTopAdd ?? 0);
	const pb = (includeContentSafeArea ? safeAreaInsets.bottom + contentSafeAreaInsets.bottom : safeAreaInsets.bottom) + (paddingBottomAdd ?? 0);
	return <div id="content-wrapper" className={"w-full flex flex-col " + className} style={{ paddingTop: pt, paddingBottom: pb }}>
		{children}
	</div>
}