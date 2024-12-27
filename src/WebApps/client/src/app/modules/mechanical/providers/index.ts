import {inspectionProvider} from "@mechanical/providers/inspection.provider";
import {supportProvider} from "@mechanical/providers/support.provider";
import {supportDetailProvider} from "@mechanical/providers/support-detail.provider";
import {vehicleProvider} from "@mechanical/providers/vehicle.provider";

export const mechanicalProvider = [
  inspectionProvider,
  supportProvider,
  supportDetailProvider,
  vehicleProvider
]
