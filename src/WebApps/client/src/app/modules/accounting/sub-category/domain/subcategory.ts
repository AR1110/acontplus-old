export interface Subcategory {
  id: number;
  categoryId: number;
  categoryName: string;
  companyId: number;
  code: string;
  name: string;
  enabled: boolean;
}

export interface SubCategorySelectHtmlOnly extends Pick<Subcategory, 'id' | 'code' | 'name'> {}
