export interface Table {
  roomId: number;
  numberTable: number;
  description: string;
  capacity: number;
  assigned?: boolean;
  id: number;
  enabled: boolean;
}
