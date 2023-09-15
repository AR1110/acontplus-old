import type { Menu } from "$core/interfaces/restaurant/menu";
import { writable } from "svelte/store";
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { MenuService } from "$core/services/restaurant/menu-service";
import { itemService } from "$core/services/restaurant/item-service";
import { MenuItemService } from "$core/services/restaurant/menu-item-service";

type StateModal = {
  isOpen: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  menus: any;
  dataUpdate: Menu;
  items: any;
  menuTypes: any;
  menuItems: any;
};

const initialState: State = {
  menus: [],
  dataUpdate: {
    id: 0,
    productId: 0,
    title: "",
    summary: "",
    typeId: 0,
    content: "",
  },
  items: [],
  menuTypes: [],
  menuItems: [],
};

const initialModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const menuStore = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const get = () => {
    showLoader();
    update((state) => ({ ...state, menus: [], menuTypes: [] }));

    MenuService.get(JSON.stringify({ tipo: 1 }))
      .then((response) => {
        update((state) => ({
          ...state,
          menus: response["menus"],
          menuTypes: response["menuTypes"],
        }));
      })
      .finally(() => {
        hideLoader();
      });
  };

  const getItems = (id: number) => {
    MenuItemService.getById(id).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          menuItems: response["menuItems"],
        }));
      }
    });
  };

  const searchItem = (params?: object) => {
    let json = { pageIndex: 1, pageSize: 10, tipo: 1, ...params };

    update((state) => {
      return { ...state, items: [] };
    });

    itemService.get(JSON.stringify(json)).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          items: response["items"],
        }));
      }
    });
  };

  const openingModal = (menu?: Menu) => {
    getItems(menu.id);
    update((state) => ({
      ...state,
      isOpen: true,
      dataUpdate: menu,
    }));
  };

  return { set, subscribe, update, get, getItems, searchItem, openingModal };
};

export const useMenuStore = menuStore();
