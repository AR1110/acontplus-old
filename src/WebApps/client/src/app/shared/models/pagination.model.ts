export class Pagination {
  pageIndex = 1;
  pageSize = 25;
  maxSize = 5;
  totalRecords = 0;

  pageSizeOptions = [25, 50, 75, 100];
}

export class MatPagination {
  pageIndex = 0;
  pageSize = 10;
  maxSize = 5;
  totalRecords = 0;

  pageSizeOptions = [10, 25, 50, 75, 100];
}
