export class InventarioModeloMapper {
  static fromApiGetAll(response: any) {
    const modelos = response.modelos || [];
    return modelos.map((item: any, index: number) => {
      return {
        index: index + 1,
        idModelo: item.idModelo,
        codigo: item.codigo,
        descripcion: item.descripcion,
        nomEstado: item.estado ? 'Activo' : 'Inactivo',
        estado: item.estado,
        idMarca: item.idMarca,
        marca: item.marca,
        totalRecords: item.totalRecords,
      };
    });
  }
}
