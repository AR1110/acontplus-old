export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean | null;
  isDeleted: boolean | null;
  createdByUserId: number | null;
}
