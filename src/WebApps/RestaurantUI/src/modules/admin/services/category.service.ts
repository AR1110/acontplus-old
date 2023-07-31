import { PATHS } from '@/core/constants/path';
import { Http } from '@/core/utils';
import { CategoryReadDto } from '../models';

const URL = 'v3/SubFamilia/'
export const CategorySvc = {
  getAll: async () => {
    const query = JSON.stringify({
      pageIndex: 1,
      pageSize: 2,
    })
    const response = await Http({
      method: 'get',
      url: `${PATHS.INVENTARIO}${URL}Get`,
      params: {
        json: query
      }  
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

  },

  post: (data: any) => {
    return Http({
      method: 'post',
      url: `Inventario/v3/SubFamilia/Post`,
      data: data,
    });
  },

  // insert: () => {
  //   return Http({
  //     method: 'post',
  //     url: PATHS.PRIVATE + 'Category',
  //   });
  // },
  update: () => {
    return Http({
      method: 'put',
      url: PATHS.PRIVATE + 'Category',
    });
  },
};
