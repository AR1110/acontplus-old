import {MenuRepository} from "@domain/repositories/menu.repository";
import {MenuLocalStorageRepositoryImpl} from "@data/local/storage/menu-local-storage.repository.impl";


export const menuProvider = {
  provide: MenuRepository,
  useClass: MenuLocalStorageRepositoryImpl
}
