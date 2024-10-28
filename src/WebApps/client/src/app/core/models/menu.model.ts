export interface Menu {
  id: number;
  name: string;
  url: string;
}

export interface Submenu {
  id: number;
  menu: Menu;
  name: string;
  url: string;
}
