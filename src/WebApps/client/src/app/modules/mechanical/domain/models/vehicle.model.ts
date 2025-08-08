
export interface Vehicle {
  id: number
  vehicleType: string
  licensePlate: string
  tradeName: string
  idCard: string
  icon: string
  enabled: boolean
}

export interface VehicleList extends Vehicle {

 }

export interface ListVehicleParams {
  pageIndex: number;
  pageSize: number;
}
 export class ListVehicleResponse {
  data: VehicleList[]=[]
   totalRecords=0;
 }
