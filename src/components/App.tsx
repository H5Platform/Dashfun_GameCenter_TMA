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
import { useEffect, type FC } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppRoute, routes } from "@/navigation/routes.tsx";
import { miniApp, postEvent, themeParams, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { UserProvider } from "./DashFun/DashFunUser";
import { LanguageProvider } from "./Language/Language";
import { Page } from "./Page";
import { CoinProvider } from "./DashFun/DashFunCoins";

const setupRoute = (route: AppRoute, wrapPage: boolean = true) => {
  let P = () => wrapPage ? <Page back={route.back} allowYScroll={route.allowYScroll}><route.Component /></Page>
    : <route.Component />;

  const subRoutes: React.JSX.Element[] = [];

  if (route.subRoutes != null && route.subRoutes.length > 0) {
    route.subRoutes.forEach(r => {
      subRoutes.push(setupRoute(r, false));
    })
  }

  const r = <Route key={route.path} path={route.path} Component={P} >
    {subRoutes}
  </Route>;

  return r;
}

export const App: FC = () => {
  console.log("init app......")
  const lp = useLaunchParams();
  console.log("launch params", lp)
  const bgClr = useSignal(themeParams.secondaryBackgroundColor);
  console.log("themeParams", bgClr)
  const routesArr = []

  useEffect(() => {
    postEvent("web_app_request_theme");
  }, [])

  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];

    // let P = () => <Page back={route.back} allowYScroll={route.allowYScroll}><route.Component /></Page>;
    // const r = <Route key={route.path} path={route.path} Component={P} />
    const r = setupRoute(route);
    routesArr.push(r);
  }

  return (
    <AppRoot
      id="appRoot"
      appearance={miniApp.isDark() ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
      className="w-full h-full"
    >
      <HashRouter>
        <LanguageProvider>
          <UserProvider>
            <CoinProvider>
              <Routes>
                {routesArr}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              {/* <RouterProvider router={appRoutes} /> */}
            </CoinProvider>
          </UserProvider>
        </LanguageProvider>
      </HashRouter>
    </AppRoot>
  );
};
