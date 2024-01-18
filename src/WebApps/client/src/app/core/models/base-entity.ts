export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  enabled: boolean | null;
  deleted: boolean | null;
  userId: number | null;
}
