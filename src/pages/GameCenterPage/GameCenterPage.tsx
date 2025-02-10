import { AppRoute, routes } from "@/navigation/routes";
import { backButton, useSignal, viewport } from "@telegram-apps/sdk-react";
import KeepAlive, { useKeepAliveRef } from "keepalive-for-react";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { ContentWrapper } from "../ContentWrapper";
import { GameCenterTab, GameCenterTabRef } from "./Components/GameCenterTab";
import "./GameCenterPage.css";
import { GameCenterDataProvider } from "./Components/GameCenterDataProvider";
export const GameCenterPage: FC = () => {
	const aliveRef = useKeepAliveRef();
	const tabRef = useRef<GameCenterTabRef>(null);
	const [tabOffset, setTabOffset] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();
	const viewportState = useSignal(viewport.state);
	let outlet = useOutlet();

	outlet = <ContentWrapper paddingBottomAdd={tabOffset}>
		{outlet}
	</ContentWrapper>

	const currentCacheKey = useMemo(() => {
		return location.pathname + location.search;
	}, [location.pathname, location.search]);

	useEffect(() => {
		const h = tabRef.current?.getHeight() || 0;
		setTabOffset(h - viewportState.safeAreaInsets.bottom);
	}, [tabRef.current])

	useEffect(() => {
		const gamecenter = routes.find(r => r.id == "gamecenter") as AppRoute;
		const currentRoute: AppRoute = gamecenter.subRoutes?.find(r => `${gamecenter.path}/${r.path}` == location.pathname) as AppRoute;

		if (currentRoute != null) {
			if (currentRoute.back == "close" || currentRoute.back == "nop") {
				backButton.hide();
			} else {
				backButton.show();
				backButton.onClick(() => {
					if (currentRoute.back == null || currentRoute.back == "back") {
						navigate(-1);
					} else {
						navigate(currentRoute.back as string);
					}
				});
			}
		}
	}, [location.pathname])

	return <div className="max-w-screen-sm sm:aligen-center sm:mx-auto h-full">
		<div id="GameCenterPage" className="w-full h-full flex flex-col ">
			<GameCenterDataProvider>
				{
					///game-center/search需要特殊处理，如果放在keepalive里面，会导致input的autoFocus失效
					location.pathname == "/game-center/search" && outlet
				}
				<KeepAlive transition={false} aliveRef={aliveRef} activeCacheKey={currentCacheKey} max={18}>
					<MemoScrollTopWrapper>
						{location.pathname != "/game-center/search" && outlet}
					</MemoScrollTopWrapper>
				</KeepAlive>
				{(location.pathname != "/game-center/search" && <GameCenterTab ref={tabRef} />)}
			</GameCenterDataProvider>
		</div>
	</div>
}


// remember the scroll position of the page when switching routes
function MemoScrollTopWrapper(props: { children?: ReactNode }) {
	const { children } = props;
	const domRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const scrollHistoryMap = useRef<Map<string, number>>(new Map());

	const activeKey = useMemo(() => {
		return location.pathname + location.search;
	}, [location.pathname, location.search]);

	useEffect(() => {
		const divDom = domRef.current;
		if (!divDom) return;
		setTimeout(() => {
			const scrollTo = scrollHistoryMap.current.get(activeKey) || 0;
			if (scrollTo != 0) {
				divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
			}
		}, 0); // 300 milliseconds to wait for the animation transition ending
		const onScroll = (e: Event) => {
			const target = e.target as HTMLDivElement;
			if (!target) return;
			scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
		};
		divDom?.addEventListener('scroll', onScroll, {
			passive: true,
		});
		return () => {
			divDom?.removeEventListener('scroll', onScroll);
		};
	}, [activeKey]);

	return (
		<div
			id="memo-scroll-top-warpper"
			className=" w-full h-full overflow-y-auto hide-scrollbar"
			ref={domRef}
		>
			{children}
		</div>
	);
}