
export interface Vehicle {
  id: number
  vehicleType: string
  licensePlate: string
  tradeName: string
  idCard: string
  icon: string
  enabled: boolean
}

export interface VehicleRead extends Vehicle {
  totalRecords: number
 }
