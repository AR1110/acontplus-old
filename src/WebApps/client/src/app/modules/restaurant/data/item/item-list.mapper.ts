import { PagedResult, PaginationParams } from '@acontplus/core';

export class ItemListMapper {
  static toJson(params: PaginationParams) {
    const queryParams = new URLSearchParams({
      pageIndex: params.pageIndex.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    // if (params.sortDirection) {
    //   queryParams.append('sortDirection', params.sortDirection);
    // }
    if (params.filters) {
      const objToJsonFilters: Record<string, string> = {
        categoryAbbreviations: 'sigla',
        categoryAbbreviation: 'sigla',
      };
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value == null) return; // 🔹 salta este item, pero sigue con los demás
        const filterKey = objToJsonFilters[key] || key;
        queryParams.append(`filters[${filterKey}]`, String(value));
      });
    }
    return queryParams.toString();
  }

  static fromJson(response: PagedResult<any>): PagedResult<any> {
    const results: PagedResult<any> = {
      ...response,
      items: [],
    };
    results.items = response.items.map((item: any, index: number) => {
      return {
        index: index + 1,
        id: item.id,
        acronymCategory: item.acronymFamily,
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

    return results;
  }
}
