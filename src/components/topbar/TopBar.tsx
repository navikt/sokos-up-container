import { Link } from "react-router";
import { InternalHeader, Spacer } from "@navikt/ds-react";
import nav from "../../../assets/images/Hvit.png";
import { useAuthContext } from "../../auth/userAuth";
import DropdownBar from "./DropdownBar";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const authContext = useAuthContext();
  return (
    <div className={styles["topbar-container"]}>
      <InternalHeader>
        <img src={nav} alt="NAV logo" className={styles["topbar-logo"]} />
        <InternalHeader.Title as={Link} to={"/"}>
          Utbetalingsportalen
        </InternalHeader.Title>
        <a href="#main-content" className={styles["screenreader-only"]}>
          Hopp til hovedinnhold
        </a>
        <Spacer />
        <DropdownBar />
        <InternalHeader.User
          name={authContext.userData.name}
          description={authContext.userData.navIdent}
        />
      </InternalHeader>
    </div>
  );
}
