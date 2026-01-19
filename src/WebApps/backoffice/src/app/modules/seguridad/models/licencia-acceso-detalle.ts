export interface LicenciaAccesoDetalle {
  id: number;
  licenciaAccesoId: number;
  menuId: number;
  order: number;
  actions?: string;
  isActive?: boolean;
  aplicacionName?: string;
  aplicacionCode?: string;
  menuCode?: string;
  menuName?: string;
  submenuName?: string;
  position?: number;
}
