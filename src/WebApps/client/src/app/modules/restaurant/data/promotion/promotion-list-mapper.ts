import { PromotionListDto } from '@restaurant/domain/models/promotion';
import { PaginationParams, PagedResult } from '@acontplus/core';
import { formatDate, formatDisplayDate } from '@core/utils/date.util';
export class PromotionListMapper {
  static toJson(params: PaginationParams) {
    const queryParams = new URLSearchParams({
      pageIndex: params.pageIndex.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    // if (params.sortBy) {
    //   queryParams.append('sortBy', params.sortBy);
    // }
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

  static fromJson(response: PagedResult<unknown>): PagedResult<PromotionListDto> {
    const results: PagedResult<PromotionListDto> = {
      ...response,
      items: [],
    };
    console.log(response.items);
    results.items = response.items.map((item: any, index: number) => {
      const schedule = JSON.parse(item.applicableDays) ?? [];
      const startDate = formatDate(item.startDate);
      const endDate = formatDate(item.endDate);
      return {
        ...item,
        index: index + 1,
        validityPeriod: `${formatDisplayDate(startDate) ?? '--'} - ${
          formatDisplayDate(endDate) ?? '--'
        }`,
        schedule,
        name: item.name,
        imageUrl:
          'https://cdn.dribbble.com/userupload/44814864/file/c52ce852f72a4f7497db49fc0d647a29.jpg?resize=400x0',
      };
    });

    return results;
  }
}
