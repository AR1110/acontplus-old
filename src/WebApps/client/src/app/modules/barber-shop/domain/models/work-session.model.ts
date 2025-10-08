import { Ticket } from '@barber-shop/domain/models/ticket.model';

export interface WorkSession {
  id: number; // Heredado de BaseEntity
  puntoEmisionId: number;
  userBarberId: number;

  startDate: string; // ISO string (DateTime en C#)
  endDate?: string;

  totalSales: number;
  totalAdvances: number;

  tickets?: Ticket[];
  // payments?: BarberPayment[];
}
