import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class VehicleMapper {
  static fromApiGetAll(response: ApiResponseLegacy) {
    let data = [] as any[];
    if (response.code === '1') {
      const { vehicles } = JSON.parse(response.payload as string);

      data = vehicles.map((item: any, index: number) => {
        return {
          ...item,
          position: index + 1,
        };
      });
    }
    return data;
  }

  static fromApiDataForm(response: ApiResponseLegacy) {
    const data = {
      countries: [],
      vehicleTypes: [],
    };
    if (response.code === '1') {
      const { countrys, vehicleTypes } = JSON.parse(response.payload as string);
      data.countries = countrys;
      data.vehicleTypes = vehicleTypes;
    }
    return data;
  }

  static fromApiGetId(response: ApiResponseLegacy) {
    const data = {
      customer: {
        businessName: null,
        id: 0,
      },
      vehicle: {},
    };
    if (response.code === '1') {
      const { customer, vehicle } = JSON.parse(response.payload as string);
      data.customer = customer[0];
      data.vehicle = vehicle[0];
    }
    return data;
  }
}
