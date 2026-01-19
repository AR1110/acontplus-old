import { UserPermissionRepositoryImpl } from '@modules/config/data/user-permission/user-permission-repository-impl';
import { AsignacionPuntoEmisionRepositoryImpl } from '@modules/config/data/asignacion-punto-emision/asignacion-punto-emision-repository-impl';
import { SolicitudAutorizacionHttp } from '@modules/config/data/https/solicitud-autorizacion-http';
import { UserRoleRepositoryImpl } from '@modules/config/data/user-role/user-role-repository-impl';
import { UserPermissionRepository } from '@modules/config/data/repositories/user-permission.repository';
import { AsignacionPuntoEmisionRepository } from '@modules/config/data/repositories/asignacion-punto-emision.repository';
import { AsignacionBodegaRepositoryImpl } from '@modules/config/data/asignacion-bodega/asignacion-bodega-repository-impl';
import { ElectronicSignatureHttp } from '@modules/config/data/https/electronic-signature-http';
import { AsignacionEstabRepositoryImpl } from '@modules/config/data/asignacion-estab/asignacion-estab-repository-impl';
import {
  ELECTRONIC_SIGNATURE_HTTP_TOKEN,
  SOLICITUD_AUTORIZACION_HTTP_TOKEN,
  PRINTER_HTTP_TOKEN,
} from '@modules/config/data/config-token';
import { GeneralConfigRepositoryImpl } from '@modules/config/data/general-config/general-config-repository-impl';
import { UserRoleRepository } from '@modules/config/data/repositories/user-role.repository';
import { ContribuyenteRepositoryImpl } from '@modules/config/data/wizard-config/contribuyente-repository.impl';
import { SolicitudUsuarioRepository } from '@modules/config/data/repositories/solicitud-usuario.repository';
import { AsignacionBodegaRepository } from '@modules/config/data/repositories/asignacion-bodega.repository';
import { UserRepositoryImpl } from '@modules/config/data/user/user-repository-impl';
import { SolicitudUsuarioWebRepository } from '@modules/config/data/printer/solicitud-usuario-web.repository';
import { AsignacionEstabRepository } from '@modules/config/data/repositories/asignacion-estab.repository';
import { ExcelImportRepositoryImpl } from '@modules/config/data/excel-import/excel-import-repository-impl';
import { GeneralConfigRepository } from '@modules/config/data/repositories/general-config.repository';
import { CreditTimeRepositoryImpl } from '@modules/config/data/credit-time/credit-time-repository.impl';
import { ContribuyenteRepository } from '@modules/config/data/repositories/contribuyente.repository';
import { UserRepository } from '@modules/config/data/repositories/user.repository';
import { DocConfigRepositoryImpl } from '@modules/config/data/doc-config/doc-config-repository.impl';
import { ExcelImportRepository } from '@modules/config/data/repositories/excel-import.repository';
import { CreditTimeRepository } from '@modules/config/data/repositories/credit-time.repository';
import { DocConfigRepository } from '@modules/config/data/repositories/doc-config.repository';
import { CompanyRepositoryImpl } from '@modules/config/data/company/company-repository.impl';
import { CompanyRepository } from '@modules/config/data/repositories/company.repository';
import { PrinterHttp } from '@modules/config/data/https/printer-http';
import { ScheduleRepository } from '@modules/config/data/repositories/schedule.repository';
import { ScheduleRepositoryImpl } from './schedule/schedule-repository.impl';
import { ShiftRepository } from '@modules/config/data/repositories/shift.repository';
import { ShiftRepositoryImpl } from './shift/shift-repository.impl';
import { Provider } from '@angular/core';

const DATA_USER_CUSTOMER_IOC: Provider[] = [
  {
    provide: UserRepository,
    useClass: UserRepositoryImpl,
  },
  {
    provide: UserRoleRepository,
    useClass: UserRoleRepositoryImpl,
  },
  {
    provide: AsignacionEstabRepository,
    useClass: AsignacionEstabRepositoryImpl,
  },
  {
    provide: AsignacionPuntoEmisionRepository,
    useClass: AsignacionPuntoEmisionRepositoryImpl,
  },
  {
    provide: AsignacionBodegaRepository,
    useClass: AsignacionBodegaRepositoryImpl,
  },
  {
    provide: UserPermissionRepository,
    useClass: UserPermissionRepositoryImpl,
  },
];

export const DATA_CONFIG_IOC: Provider[] = [
  {
    provide: CompanyRepository,
    useClass: CompanyRepositoryImpl,
  },
  {
    provide: GeneralConfigRepository,
    useClass: GeneralConfigRepositoryImpl,
  },
  {
    provide: ExcelImportRepository,
    useClass: ExcelImportRepositoryImpl,
  },
  {
    provide: PRINTER_HTTP_TOKEN,
    useClass: PrinterHttp,
  },
  {
    provide: SOLICITUD_AUTORIZACION_HTTP_TOKEN,
    useClass: SolicitudAutorizacionHttp,
  },
  {
    provide: SolicitudUsuarioRepository,
    useClass: SolicitudUsuarioWebRepository,
  },
  {
    provide: ELECTRONIC_SIGNATURE_HTTP_TOKEN,
    useClass: ElectronicSignatureHttp,
  },
  {
    provide: SOLICITUD_AUTORIZACION_HTTP_TOKEN,
    useClass: SolicitudAutorizacionHttp,
  },
  {
    provide: CreditTimeRepository,
    useClass: CreditTimeRepositoryImpl,
  },
  {
    provide: DocConfigRepository,
    useClass: DocConfigRepositoryImpl,
  },
  {
    provide: ContribuyenteRepository,
    useClass: ContribuyenteRepositoryImpl,
  },
  {
    provide: ShiftRepository,
    useClass: ShiftRepositoryImpl,
  },
  {
    provide: ScheduleRepository,
    useClass: ScheduleRepositoryImpl,
  },

  //user-customer
  ...DATA_USER_CUSTOMER_IOC,
];
