export interface WhatsappUsage {
  id: number;
  startDate: null | Date;
  endDate: null | Date;
  limit: number;
  unlimited: boolean;
  used?: number;
  isActive: boolean;
  userId?: number;
  companyId: number;
  idCard: string;
  companyName?: string;
}
