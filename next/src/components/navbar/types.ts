export type NavbarOpenHandler = () => void;
export enum NavbarType {
  HOMEPAGE,
  MINIPAGE
}

export type NavbarOpenProps = {
  open: boolean,
  setNavbarOpen: NavbarOpenHandler,
  variant: NavbarType 
};

export type HamburgerMenuProps = {
  open: boolean,
  setNavbarOpen: NavbarOpenHandler,
}