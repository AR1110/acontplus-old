import { VehiclePart } from '@mechanical/domain/models/vehicle-part';
import { VehiclePartType } from '@mechanical/domain/models/vehicle-part-type';
import { ApiResponse } from '@core/models/api-response';
import { formatDate } from '@core/utils/date.util';
import { isValidJSON } from '@core/utils/utils';

export class InspeccionMapper {
  static getAll(response: ApiResponse) {
    let results: any = [];
    if (response.code === '1') {
      const { inspection } = JSON.parse(response.payload as string);

      results = inspection.map((item: any, index: number) => {
        return {
          index: index + 1,
          id: item.id,
          supportId: item.supportId,
          mileage: item.mileage,
          fuellevel: item.fuellevel,
          businessName: item.businessName,
          licensePlate: item.licensePlate,
          brand: item.brand,
          vehicleType: item.vehicleType,
          codEstab: item.codEstab,
        };
      });
    }
    return results;
  }

  static getDataForm(response: ApiResponse) {
    const result = {
      support: {} as any,
      data: {},
      vehicleParts: [] as VehiclePart[],
      vehiclePartTypes: [] as VehiclePartType[],
    };

    if (response.code === '1') {
      const { support, vehiclePart, vehiclePartType } = JSON.parse(response.payload as string);
      result.support = support[0];

      result.vehicleParts = vehiclePart;
      result.vehiclePartTypes = vehiclePartType;
    }
    return result;
  }

  static getId(response: ApiResponse) {
    const result = {
      data: {} as any,
      vehicleParts: [] as VehiclePart[],
    };

    if (response.code === '1') {
      const { inspection } = JSON.parse(response.payload as string);
      const mainData = inspection[0];

      result.data = {
        id: mainData.id,
        fechaEmision: formatDate(mainData.date),
        mileage: mainData.mileage,
        fuelLevel: mainData.fuelLevel,
        obs: mainData.obs,
        fechaEmisionDocCreado: formatDate(mainData.date),
      };

      let vehicleParts: any[] = [];

      // Recorre cada propiedad del objeto infrastructure
      for (const key in mainData) {
        const value = mainData[key];
        if (typeof value === 'string' && isValidJSON(value)) {
          const parsedArray = JSON.parse(value);
          if (Array.isArray(parsedArray)) {
            // Agrega los objetos del array a parsedData

            vehicleParts = [...vehicleParts, ...parsedArray];
          }
        }
      }

      result.vehicleParts = vehicleParts;
    }
    return result;
  }
}
