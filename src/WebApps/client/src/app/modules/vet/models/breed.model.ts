import { PetType } from '@modules/vet/models/pet-type.model';

export interface Breed {
  id: number;
  petTypeId: number;
  code: string;
  name: string;
  description?: string;
  petType?: PetType;
  enabled: boolean;
}
