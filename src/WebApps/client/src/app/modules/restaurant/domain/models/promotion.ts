export interface PromotionListDto {
  id: number;
  name: string;

  isActive: boolean;
}

export interface DailySchedule {
  day: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface Promotion {
  id?: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  schedule: DailySchedule[];
  createdBy: string;
}

export interface DiscountType {
  value: 'percentage' | 'fixed';
  label: string;
}

export const DISCOUNT_TYPES: DiscountType[] = [
  { value: 'percentage', label: 'Porcentaje (%)' },
  { value: 'fixed', label: 'Monto Fijo' },
];

export const DAYS_OF_WEEK: string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
