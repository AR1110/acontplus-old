import { ClassProvider } from '@angular/core';
import {ImportacionRepository} from "@modules/config/domain/repositories/importacion.repository";
import {ImportacionRepositoryImpl} from "@modules/config/data/importacion/importacion-repository-impl";

export const importacionProvider: ClassProvider = {
  provide: ImportacionRepository,
  useClass: ImportacionRepositoryImpl,
};
