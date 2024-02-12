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
  specs?: DeviceSpecs;
}

export interface DeviceCustomer {
  customerCompanyId: number;
  deviceId?: number;
}

export interface DeviceSpecs {
  deviceId?: number;
  specs: string;
}

export interface DeviceSearch {
  model: string;
  name: string;
  serie?: string;
  color?: string;
}
