export class SubCategoryMapper {
  static fromApiGetAll(response: any) {
    const subcategories = response.subcategories || [];

    return subcategories.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.id,
        categoryId: item.categoryId,
        companyId: item.companyId,
        code: item.code,
        name: item.name,
        enabled: item.enabled,
        userId: item.userId,
        categoryName: item.categoryName,
        nomEstado: item.enabled ? 'Activo' : '',
      };
    });
  }
}
