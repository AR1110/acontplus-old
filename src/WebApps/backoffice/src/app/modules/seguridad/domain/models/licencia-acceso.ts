import { LicenciaAccesoDetalle } from '../../models/licencia-acceso-detalle';
import { Menu } from '@modules/config/models/menu';

export interface LicenciaAcceso {
  id: number;
  licenciaId: number;
  roleId: number;
  isActive?: boolean;
  licenciaAccesoDetalles: LicenciaAccesoDetalle[];
}

export interface LicenciaAccesoMenu
  extends Pick<
    Menu,
    'id' | 'name' | 'url' | 'aplicacionId' | 'order' | 'isActive'
  > {
  aplicacionName: string;
  menuName: string;
  position?: number;
}

export interface ListLicenseAccess{
  id: number;
  index: number
  "isActive": boolean;
  "deleted": boolean
  "licenciaId":number
  "licenseTypeId": number
  "licenseTypeName": string
  "roleId": number
  "name": string
}
export class ListLicenseAccessResponse {
  data: ListLicenseAccess[]=[];
  totalRecords = 0;
}
