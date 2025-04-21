export interface Ticket {
  id: number; // Asumiendo que BaseEntity tiene una propiedad 'id'
  sequence: number;
  serie: string;
  status: TicketStatus;
  observations?: string;

  subTotal: number;
  discount?: number;
  total: number;

  birthdayDiscount?: boolean;
  loyaltyDiscount?: boolean;

  seatId: number;
  seat?: Seat;

  customerId?: number;

  sessionId?: number;
  session?: WorkSession;

  details?: TicketDetail[];
}

// Enum para TicketStatus (ajusta según tu backend)
export enum TicketStatus {
  Pending = 0,
  Paid = 1,
  Cancelled = 2,
  // Agrega los estados reales que uses
}

// Interfaces relacionadas
export interface Seat {
  id: number;
  name: string;
  // Otras propiedades que tengas en Seat
}

export interface WorkSession {
  id: number;
  date: string;
  // Otras propiedades de sesión
}

export interface TicketDetail {
  id: number;
  serviceName: string;
  price: number;
  // Otras propiedades del detalle
}
