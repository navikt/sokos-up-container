import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Route, Routes, useLocation } from "react-router";
import Microfrontend from "./Microfrontend";
import { AuthProvider } from "./components/auth/AuthProvider";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Layout from "./components/layout/Layout";
import { MicrofrontendApp, MicrofrontendConfig } from "./config/microfrontend";
import ErrorPage, { NotFound } from "./pages/ErrorPage";
import Home from "./pages/Home";
import { initGrafanaFaro } from "./utils/grafanaFaro";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.MODE !== "mock") initGrafanaFaro();
  }, []);

  useEffect(() => {
    const currentRoute = location.pathname;
    const appTitle =
      MicrofrontendConfig.find((app) => currentRoute.includes(app.route))
        ?.title || "";
    const title =
      currentRoute === "/"
        ? "Utbetalingsportalen"
        : `${appTitle} | Utbetalingsportalen`;

    document.title = title;
  }, [location]);

  function TheMicrofrontend(app: MicrofrontendApp) {
    return (
      <Microfrontend
        key={`Microfrontend ${app.title}`}
        url={app.url}
        adGroup={app.group}
      />
    );
  }

  function microfrontendRoutes() {
    return MicrofrontendConfig.sort((a, b) =>
      a.title.localeCompare(b.title),
    ).map((app) => (
      <Route key={app.title} path={app.route}>
        <Route
          index
          key={`${app.title}index`}
          element={TheMicrofrontend(app)}
        />
        <Route
          path={"*"}
          key={`${app.title}`}
          element={TheMicrofrontend(app)}
        />
      </Route>
    ));
  }

  return (
    <>
      <Helmet>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <script
          defer
          src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
          data-host-url="https://umami.nav.no"
          data-website-id="e174f8d8-4082-4cb0-8280-b992d0a47901"
        ></script>
      </Helmet>
      <ErrorBoundary>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
              {microfrontendRoutes()}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}
