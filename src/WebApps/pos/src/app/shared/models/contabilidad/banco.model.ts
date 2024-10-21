
export interface Banco {
  idBanco: number,
  descripcion: string,
  codigo: string,
}


export interface BancoSelectHtmlOnly extends Pick<Banco, 'idBanco' | 'descripcion'> { }
