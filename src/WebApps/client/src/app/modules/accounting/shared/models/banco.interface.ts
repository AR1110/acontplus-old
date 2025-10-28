export interface Banco {
  idBanco: number;
  descripcion: string;
  codigo: string;
}

export interface BancoSelectOnly extends Pick<Banco, 'idBanco' | 'descripcion' | 'codigo'> {}
