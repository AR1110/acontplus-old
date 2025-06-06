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
  totalRecords?: number;
}

export interface DiseaseStatus {
  id: number;
  name: string;
}

export interface Disease {
  id: number;
  name: string;
}

export interface BehaviorStatus {
  id: number;
  name: string;
}

export interface Behavior {
  id: number;
  name: string;
}

export interface BehaviorTest {
  id: number;
  medicalHistoryId: number;
  behaviorId: number;
  behaviorStatusId: number;
}

export interface HealthCheck {
  id: number;
  medicalHistoryId: number;
  diseaseId: number;
  diseaseStatusId: number;
}
