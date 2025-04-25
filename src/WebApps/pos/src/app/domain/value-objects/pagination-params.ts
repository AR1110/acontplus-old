import { PageNumber } from './page-number.vo';
import { PageSize } from './page-size.vo';

export class PaginationParams {
  constructor(
    public readonly page: PageNumber,
    public readonly pageSize: PageSize
  ) {}

  toQuery(): { page: number; pageSize: number } {
    return {
      page: this.page.getValue(),
      pageSize: this.pageSize.getValue()
    };
  }
}
