export interface Pet {
  id: number;
  customerId: number;
  customer?: string;
  companyId: number;
  name: string;
  breedId: number;
  breed: string;
  genderId: number;
  age?: number;
  color: string;
  birthdate?: Date;
  enabled: boolean;
  petType: string;
}
