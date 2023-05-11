import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { authenticationLoader } from "./api/api";
import Layout from "./components/layout/Layout";
import SokosMikrofrontendTemplate from "./micro-frontend/SokosMikrofrontendTemplate";
import UtbetalingFrontendPoc from "./micro-frontend/UtbetalingFrontendPoc";
import { Path } from "./models/path";
import Feilside from "./pages/Feilside";
import Information from "./pages/Information";

const App = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route
            path="/"
            element={<Layout />}
            loader={authenticationLoader}
            errorElement={
              <Feilside
                tittel={"Siden finnes ikke"}
                melding={"Du har forsøkt å gå inn på en side som ikke eksisterer!"}
                knapp
              />
            }
          >
            <Route path="/" element={<Information />} />
            <Route path={Path.SOKOS_MIKROFRONTEND_TEMPLATE} element={<SokosMikrofrontendTemplate />} />
            <Route path={Path.UTBETALINGER} element={<UtbetalingFrontendPoc />} />
          </Route>
        )
      )}
    />
  );
};

export default App;
