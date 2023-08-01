import { PATHS } from '@/core/constants/path';
import { Http, HttpUploadFile, loadAbort } from '@/core/utils';
import { CategoryReadDto } from '../models';

const URL = 'v3/SubFamilia/'
export const CategorySvc = {
  getAll: async (): Promise<CategoryReadDto[]> => {
    const controller = loadAbort(); //Cancelar peticion 
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 50,
    })
    const response = await Http({
      method: 'get',
      url: `${PATHS.INVENTARIO}${URL}Get`,
      params: {
        json: query
      },
      signal: controller.signal
    }); 

    if(response.code=="1"){
      const categories = JSON.parse(response.payload);
 
      return  categories.map((item: CategoryReadDto) =>({ 
        codigo: item.codigo,
        descripcion: item.descripcion,
        estado: item.estado,
        idFamilia: item.idFamilia,
        idSubFamilia: item.idSubFamilia,
        montoObjetivo: item.montoObjetivo,
        nombreFamilia: item.nombreFamilia,
        siglas: item.siglas,
        totalRecords: item.totalRecords
      }) )
    } 
    return []
  },

  post: async (data: any) => {

    console.log(data)

    const response = await Http({
      method: 'post',
      url: `${PATHS.INVENTARIO}${URL}Post`,
      data
    });

    console.log(response); 
  },

  // insert: () => {
  //   return Http({
  //     method: 'post',
  //     url: PATHS.PRIVATE + 'Category',
  //   });
  // },
  update: async (id: number, data: any) => {
    const response = await Http({
      method: 'post',
      url: `${PATHS.INVENTARIO}${URL}Update`,
      params: {
        id
      },
      data: {data}
    });

    console.log(response);
  },

  imageUpload: async(data: any) => {
    const response = await HttpUploadFile({
      method: 'post',
      url: `${PATHS.INVENTARIO}${URL}Post`,
      data
    });

    console.log(response);
  }
};
