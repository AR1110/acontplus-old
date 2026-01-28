
import {ActionRepository} from "@modules/seguridad/domain/repositories/action.repository";
import {ActionRepositoryImpl} from "@modules/seguridad/data/action/action-repository-impl";

export const actionProvider = {
  provide: ActionRepository,
  useClass: ActionRepositoryImpl,
};
