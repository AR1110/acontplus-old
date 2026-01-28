export interface Company {
  id: number;
  idCard: string;
  businessName: string;
  tradeName: string;
  email: string;
  address: string;
  isActive?: boolean;
  telephone?: string;
  totalRecords: number;
}

export interface CompanySearch {
  id: number;
  uuid: string;
  idCard: string;
  tradeName: string;
  businessName: string;
}
