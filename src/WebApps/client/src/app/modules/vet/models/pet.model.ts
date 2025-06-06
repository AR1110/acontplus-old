export interface Pet {
  id: number;
  customerId: number;
  customer?: string;
  companyId: number;
  name: string;
  breedId: number;
  breed: string;
  genderId: number;
  color: string;
  birthdate?: string;
  enabled: boolean;
  petType: string;
}
