export interface Release {
  id: number;
  aplicacionId: number;
  aplicacionName?: string;
  version?: string;
  releaseDate: string;
  title: string;
  content: string;
  logoutRequired: boolean;
  isActive: boolean;
}
