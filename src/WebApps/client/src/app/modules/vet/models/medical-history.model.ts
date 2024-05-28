export interface MedicalHistory {
  id: number;
  date: string;
  establecimientoId: number;
  petId: number;
  observations: string;
  age?: number;
  weight?: number;
  enabled: boolean;
  petName: string;
}
