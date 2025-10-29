export class ItemListMapper {

  static toJson(obj:any){
    return JSON.stringify({
      tipo: 1,
      ...obj,
      pageIndex: obj.pageIndex || 1,
      pageSize: obj.pageSize || 15,
      sigla: obj.categoriesSigla ?? null
    })
  }

  static fromJson(response:any){
    const results = {
      data: [],
      totalRecords: 0
    }
    if(response.code==="1"){
      const {items} = JSON.parse(response.payload as string);
      console.log(items);
      results.data = items.map((item:any, index: number) => {
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
        }
      })
      results.totalRecords = items.length>0?items[0].total_records:0;
    }

    return results;
  }
}
