export interface Device {
  id: number;
  categoryId: number;
  name: string;
  serie: string;
  brand: string;
  model: string;
  year: number;
  warranty: number;
  color: string;
  customers?: DeviceCustomer[];
}

export interface DeviceCustomer {
  customerCompanyId: number;
  deviceId?: number;
}
