
export class TagMapper {
  static fromApiGetAll(response: any) {
    const tags = response.tags || [];
    return tags.map((item: any) => {
      return {
        idEtiqueta: item.idEtiqueta,
        descripcion: item.descripcion,
        etiquetas: item.etiquetas,
        estado: item.estado,
      };
    });
  }
}
