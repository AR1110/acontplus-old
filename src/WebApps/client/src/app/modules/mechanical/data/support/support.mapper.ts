import { ApiResponse } from "@core/models/api-response";
import {formatDate} from "@core/utils/date.util";


export class SupportMapper {

  static fromApiGetAll(response: ApiResponse) {

    let results = [];
    if (response.code === "1") {
      let { supports } = JSON.parse(response.payload as string);

      results = supports.map((item: any, index: number) => {
        return {
          position: index + 1,
          id: item.id,
          sequence: item.sequence,
          fechaEmision: item.date,
          idCard: item.idCard,
          tradeName: item.tradeName,
          licensePlate: item.licensePlate,
          status: item.status,
          colorRow: item.colorRow,
          userAssigned: item.userAssigned,
          totalRecords: item.totalRecords,
          obs: item.obs,
          codEstab: item.codEstab,
          typeStatus: item.typeStatus,
          existsInsp: item.existsInsp

        }
      })
    }
    return results;

  }


  static fromApiFilter(response: ApiResponse) {

    let data = {
      supportStatus: [] as any[]

    }
    if (response.code === "1") {

      const { supportStatus } = JSON.parse(response.payload as string);

      data.supportStatus = supportStatus;


    }
    return data;
  }


  static fromApiDashboard(response: ApiResponse) {

    let result = {
      data: {
        quantitySupport: 0,
        quantityVehicleCompany: 0,
        quantityInspection: 0,
      },
      barchart: [] as any
    }
    if (response.code === "1") {
      let mainData = JSON.parse(response.payload as string);

      let quantity = mainData.quantity[0];
      result.data = {
        quantitySupport: quantity.quantitySupport,
        quantityVehicleCompany: quantity.quantityVehicleCompany,
        quantityInspection: quantity.quantityInspection,
      }
      result.barchart = mainData.barchart;
    }
    return result;

  }


  static fromApiGetId(response: ApiResponse) {

    let result = {
      data: {},
      vehicle: {},
      customer: {
        tradeName: ''
      }
    };
    if (response.code==="1") {
      const {support, paramaters, vehicle, customer} = JSON.parse(response.payload as string);
      let mainData = support[0];
      let pr =  paramaters[0]

      result.data = {
        id: mainData.id,
        establecimientoId: pr.establecimientoId,
        puntoEmisionId: mainData.puntoEmisionId,
        vehicleCompanyId: mainData.vehicleCompanyId,
        customerId: mainData.customerId,
        userAssignedId: mainData.userAssignedId,
        fechaEmision: formatDate(mainData.date),
        fechaEmisionDocCreado: formatDate(mainData.date),
        obs: mainData.obs,
        status: mainData.status,
        sequence: pr.sequence
      }

      result.vehicle = vehicle[0];
      result.customer = customer[0]
    }
    return result;
  }


  static fromApiDataForm(response:ApiResponse){
    const result = {
      establishments: [],
      emissionPoints: [],
      users: []
    }
    if(response.code==="1"){
      const {establishments, emissionPoints, users} = JSON.parse(response.payload as string);
      result.establishments = establishments;
      result.emissionPoints = emissionPoints;
      result.users = users;
    }

    return  result;
  }

}
