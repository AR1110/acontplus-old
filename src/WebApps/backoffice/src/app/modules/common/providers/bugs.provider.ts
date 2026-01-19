
import {BugsRepository} from "@modules/common/domain/repositories/bugs.repository";
import {BugsRepositoryImpl} from "@modules/common/data/bugs/bugs-repository-impl";

export const bugsProvider = {
  provide: BugsRepository,
  useClass: BugsRepositoryImpl,
};
