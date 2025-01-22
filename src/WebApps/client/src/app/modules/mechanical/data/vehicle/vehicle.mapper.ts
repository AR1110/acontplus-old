import {ApiResponse} from "@core/models/api-response";


export class VehicleMapper {

  static fromApiGetAll(response:ApiResponse){

    let data = [] as any[]
    if(response.code==="1"){
      let {vehicles} = JSON.parse(response.payload as string)

      data = vehicles.map((item: any, index: number) => {
        return {
          ...item,
          position: index + 1
        }
      });
    }
    return  data ;
  }

  static fromApiDataForm(response:ApiResponse){

    let data = {
      countries: [],
      vehicleTypes: []
    }
    if (response.code==="1") {
      let {countrys, vehicleTypes} = JSON.parse(response.payload as string);
      data.countries = countrys;
      data.vehicleTypes = vehicleTypes;
    }
    return data;
  }
}
