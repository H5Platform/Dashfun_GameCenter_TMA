import { AppRoute, routes } from "@/navigation/routes";
import { useSignal, viewport } from "@telegram-apps/sdk-react";
import { Tabbar } from "@telegram-apps/telegram-ui";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//selectedTab不用了，改为使用location自动判断选中的是哪个tab

export const GameCenterTab = forwardRef<GameCenterTabRef>(({ }, ref) => {
	const divRef = useRef<HTMLDivElement>(null);
	const bottom = useSignal(viewport.safeAreaInsetBottom);
	const navigate = useNavigate();
	const l = useLocation();

	const gamecenter = routes.find(r => r.id == "gamecenter") as AppRoute;
	const main = gamecenter.subRoutes?.find(r => r.id == "gamecenter-main") as AppRoute;
	const games = gamecenter.subRoutes?.find(r => r.id == "gamecenter-games") as AppRoute;
	const tasks = gamecenter.subRoutes?.find(r => r.id == "gamecenter-tasks") as AppRoute;
	const friends = gamecenter.subRoutes?.find(r => r.id == "gamecenter-friends") as AppRoute;
	const tops = gamecenter.subRoutes?.find(r => r.id == "gamecenter-tops") as AppRoute;


	useImperativeHandle(ref, () => ({
		getHeight: () => {
			const divTab = divRef.current?.querySelector("#bottomNavigation") as HTMLElement;
			return divTab?.offsetHeight || 0;
		}
	}))

	const fullpath = (path: string): string => {
		return "/game-center/" + path;
	}

	const tabs: AppRoute[] = [
		tasks,
		games,
		main,
		friends,
		tops,
	]

	const tabItems = [];
	for (let index = 0; index < tabs.length; index++) {
		const { path, title, icon } = tabs[index];
		const Icon = () => <div className="my-1">{icon}</div>
		const selected = l.pathname.endsWith(path);
		tabItems.push(<Tabbar.Item
			key={path}
			text={title}
			selected={selected}
			onClick={() => {
				if (!selected) {
					console.log("navigate to " + fullpath(path));
					navigate(fullpath(path));
				}
			}}
		>
			<Icon />
		</Tabbar.Item>)
	}

	return <div ref={divRef} >
		<Tabbar id="bottomNavigation"
			style={{ paddingBottom: bottom + "px" }}
			className="max-w-screen-sm sm:left-[50%] sm:right-[-50%] sm:translate-x-[-50%]"
		>
			{tabItems}
		</Tabbar>
	</div>
})

export interface GameCenterTabRef {
	getHeight: () => number;
}
