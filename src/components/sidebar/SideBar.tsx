import { HouseIcon, MenuHamburgerIcon, XMarkIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import useApps from "../../hooks/useApps";
import { EVENT_NAME } from "../../umami/EventLogging";
import styles from "./SideBar.module.css";
import SideBarLink from "./SideBarLink";

type SideBarProps = {
  onToggle: (isOpen: boolean) => void;
  showSideBar?: boolean;
};

export default function SideBar({ onToggle, showSideBar }: SideBarProps) {
  const { authorizedApps } = useApps();

  const handleToggle = () => {
    onToggle(!showSideBar);
  };

  if (!showSideBar) {
    return (
      <div className={`${styles.closed} ${styles.sidebar}`} role="navigation">
        <Button
          className={styles["button-color"]}
          data-umami-event={EVENT_NAME.AAPNE_SIDEBAR}
          onClick={handleToggle}
          variant="primary-neutral"
          icon={<MenuHamburgerIcon title="Hamburgermeny ikon" />}
        />
      </div>
    );
  }

  function getMicrofrontendLinks() {
    return authorizedApps.map((page) => (
      <li key={page.app} className={styles["sidebar-links"]}>
        <SideBarLink
          to={page.route}
          data-umami-event={EVENT_NAME.SIDEBAR_LINK_TRYKKET}
          data-umami-event-app={page.title}
          key={page.app}
        >
          {page.title}
        </SideBarLink>
      </li>
    ));
  }

  return (
    <div className={styles["sidebar"]} role="navigation">
      <div className={styles["closebutton"]}>
        <Button
          data-umami-event={EVENT_NAME.LUKK_SIDEBAR}
          className={styles["button-color"]}
          onClick={handleToggle}
          icon={<XMarkIcon title="Kryss" />}
          iconPosition="right"
          variant="primary-neutral"
        >
          Lukk
        </Button>
      </div>

      <ul className={styles["sidebar-list"]}>
        <li className={styles["sidebar-links"]}>
          <SideBarLink
            to={"/"}
            data-umami-event={EVENT_NAME.SIDEBAR_LINK_TRYKKET}
            data-umami-event-app={"Hjem"}
          >
            <HouseIcon className={styles["icon-style"]} title="Hus" />
            Hjem
          </SideBarLink>
        </li>
        {getMicrofrontendLinks()}
      </ul>
    </div>
  );
}
