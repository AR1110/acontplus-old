export class ItemListMapper {
  static toJson(obj: any) {
    return JSON.stringify({
      tipo: 1,
      pageIndex: obj.pageIndex || 1,
      pageSize: obj.pageSize || 15,
      sigla: obj.categoryAbbreviations || obj.categoryAbbreviation || null,
      textSearch: obj.q || null,
    });
  }

  static fromJson(response: any) {
    const results = {
      data: [],
      totalRecords: 0,
    };
    if (response.code === '1') {
      const { items = [], pagination = [] } = JSON.parse(response.payload as string);
      console.log(items, pagination);
      results.data = items.map((item: any, index: number) => {
        return {
          index: index + 1,
          id: item.id,
          productId: item.productId,
          title: item.title,
          summary: item.summary,
          imageUrl: item.s3ObjectUrl,
          description: item.description,
          code: item.code,
          measure: item.measure,
          auxiliaryCode: item.auxiliary_code,
          costPrice: item.costPrice,
          category: item.category,
        };
      });
      results.totalRecords = pagination.length > 0 ? pagination[0].total_records : 0;
    }

    return results;
  }
}
