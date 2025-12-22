import { SubCategoryListDto } from '@inventory/data/models/sub-category.model';

export class SubCategoryMapper {
  static toJson(obj: any): string {
    return JSON.stringify({
      ...obj,
      tipo: 1,
    });
  }

  static fromApiResponse(apiData: any, index:number): SubCategoryListDto {
    return {
      index: ++index,
      id: apiData.idSubFamilia,
      idFamilia: apiData.idFamilia,
      descripcion: apiData.descripcion,
      estado: apiData.estado,
      siglas: apiData.siglas,
      codigo: apiData.codigo,
      montoObjetivo: apiData.montoObjetivo,
      nombreFamilia: apiData.nombreFamilia,
      ultimoSecuencial: apiData.ultimoSecuencial,
      imageUrl: apiData.s3ObjectUrl,
      s3ObjectKey: apiData.s3ObjectKey,
      subcategoryPhotoId: apiData.subcategoryPhotoId,
      totalRecords: apiData.totalRecords,
    };
  }

  static fromApiResponseList(apiDataList: any[]): SubCategoryListDto[] {
    return apiDataList.map((item, index:number) => this.fromApiResponse(item, index));
  }
}
