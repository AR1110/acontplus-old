export interface Supplier {
  idProveedor: number
  numeroIdentificacion: string
  razonSocial: string
  tipoIdentificacion: string
  subContribuyente: string
}


export interface SupplierSearch extends Supplier { }
