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
  deviceSpecId?: number;
}

export interface DeviceCustomer {
  customerCompanyId: number;
  deviceId?: number;
}

export interface DeviceSpecs {
  deviceSpecId?: number;
  deviceId?: number;
  specs: string;
}

export interface DeviceTypeSpec {
  deviceId?: number;
  uuid: string;
  name: string;
  specs: Array<DeviceSpec01>;
}

export interface DeviceSpec01 {
  uuid: string;
  name: string;
  value: string;
}

export interface DeviceSearch {
  model: string;
  name: string;
  serie?: string;
  color?: string;
}
