import { UserCustomerPermissionRepositoryImpl } from '@modules/config/data/user-customer-permission/user-customer-permission-repository-impl';
import { AsignacionPuntoEmisionRepositoryImpl } from '@modules/config/data/asignacion-punto-emision/asignacion-punto-emision-repository-impl';
import { SolicitudAutorizacionRepositoryImpl } from '@modules/config/data/solicitud-autorizacion/solicitud-autorizacion-repository-impl';
import { UserCustomerRoleRepositoryImpl } from '@modules/config/data/user-customer-role/user-customer-role-repository-impl';
import { UserCustomerPermissionRepository } from '@modules/config/domain/repositories/user-customer-permission.repository';
import { AsignacionPuntoEmisionRepository } from '@modules/config/domain/repositories/asignacion-punto-emision.repository';
import { AsignacionBodegaRepositoryImpl } from '@modules/config/data/asignacion-bodega/asignacion-bodega-repository-impl';
import { SolicitudAutorizacionRepository } from '@modules/config/domain/repositories/solicitud-autorizacion.repository';
import { ElectronicSignatureRepoImpl } from '@modules/config/data/electronic-signature/electronic-signature-repo.impl';
import { AsignacionEstabRepositoryImpl } from '@modules/config/data/asignacion-estab/asignacion-estab-repository-impl';
import { ElectronicSignatureRepository } from '@modules/config/domain/repositories/electronic-signature.repository';
import { GeneralConfigRepositoryImpl } from '@modules/config/data/general-config/general-config-repository-impl';
import { UserCustomerRoleRepository } from '@modules/config/domain/repositories/user-customer-role.repository';
import { ContribuyenteRepositoryImpl } from '@modules/config/data/wizard-config/contribuyente-repository.impl';
import { SolicitudUsuarioRepository } from '@modules/config/domain/repositories/solicitud-usuario.repository';
import { AsignacionBodegaRepository } from '@modules/config/domain/repositories/asignacion-bodega.repository';
import { UserCustomerRepositoryImpl } from '@modules/config/data/user-customer/user-customer-repository-impl';
import { SolicitudUsuarioWebRepository } from '@modules/config/data/printer/solicitud-usuario-web.repository';
import { AsignacionEstabRepository } from '@modules/config/domain/repositories/asignacion-estab.repository';
import { ExcelImportRepositoryImpl } from '@modules/config/data/excel-import/excel-import-repository-impl';
import { GeneralConfigRepository } from '@modules/config/domain/repositories/general-config.repository';
import { CreditTimeRepositoryImpl } from '@modules/config/data/credit-time/credit-time-repository.impl';
import { ContribuyenteRepository } from '@modules/config/domain/repositories/contribuyente.repository';
import { UserCustomerRepository } from '@modules/config/domain/repositories/user-customer.repository';
import { DocConfigRepositoryImpl } from '@modules/config/data/doc-config/doc-config-repository.impl';
import { ExcelImportRepository } from '@modules/config/domain/repositories/excel-import.repository';
import { CreditTimeRepository } from '@modules/config/domain/repositories/credit-time.repository';
import { DocConfigRepository } from '@modules/config/domain/repositories/doc-config.repository';
import { CompanyRepositoryImpl } from '@modules/config/data/company/company-repository.impl';
import { PrinterRepository } from '@modules/config/domain/repositories/printer.repository';
import { CompanyRepository } from '@modules/config/domain/repositories/company.repository';
import { PrinterWebRepository } from '@modules/config/data/printer/printer-web.repository';
import { ScheduleRepository } from '../domain/repositories/schedule.repository';
import { ScheduleRepositoryImpl } from './schedule/schedule-repository.impl';
import { ShiftRepository } from '../domain/repositories/shift.repository';
import { ShiftRepositoryImpl } from './shift/shift-repository.impl';
import { Provider } from '@angular/core';

const DATA_USER_CUSTOMER_IOC: Provider[] = [
  {
    provide: UserCustomerRepository,
    useClass: UserCustomerRepositoryImpl,
  },
  {
    provide: UserCustomerRoleRepository,
    useClass: UserCustomerRoleRepositoryImpl,
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
    provide: UserCustomerPermissionRepository,
    useClass: UserCustomerPermissionRepositoryImpl,
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
    provide: PrinterRepository,
    useClass: PrinterWebRepository,
  },
  {
    provide: SolicitudAutorizacionRepository,
    useClass: SolicitudAutorizacionRepositoryImpl,
  },
  {
    provide: SolicitudUsuarioRepository,
    useClass: SolicitudUsuarioWebRepository,
  },
  {
    provide: ElectronicSignatureRepository,
    useClass: ElectronicSignatureRepoImpl,
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
