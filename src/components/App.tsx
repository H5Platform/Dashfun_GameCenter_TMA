// import {
//   bindMiniAppCSSVars,
//   bindThemeParamsCSSVars,
//   bindViewportCSSVars,
//   initNavigator,
//   useLaunchParams,
//   useMiniApp,
//   useThemeParams,
//   useViewport,
//   useSwipeBehavior,
// } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { type FC } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { routes } from "@/navigation/routes.tsx";
import { miniApp, themeParams, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { UserProvider } from "./DashFun/DashFunUser";
import { Page } from "./Page";

export const App: FC = () => {
  const lp = useLaunchParams();
  const bgClr = useSignal(themeParams.secondaryBackgroundColor);
  console.log("themeParams", bgClr)
  const routesArr = []

  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];

    let P = () => <Page back={route.back} allowYScroll={route.allowYScroll}><route.Component /></Page>;
    // if (route.show) {
    // 	Page = () => {
    // 		return <TabWrapper tabId={route.id}><route.Component /></TabWrapper>
    // 	}
    // }
    const r = <Route key={route.path} path={route.path} Component={P} />
    routesArr.push(r);
  }



  return (
    <AppRoot
      id="appRoot"
      appearance={miniApp.isDark() ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
      className="w-full h-full"
    >
      <UserProvider>
        <HashRouter>
          <Routes>
            {/* {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))} */}
            {routesArr}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </UserProvider>
    </AppRoot>
  );
};
