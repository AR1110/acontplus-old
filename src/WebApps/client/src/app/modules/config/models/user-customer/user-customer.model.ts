export interface UserCustomer {
  idUsuario: number
  nroIdentificacion: string
  nombreUsuario: string
  correo: string
  nombreCompleto: string
}

export interface UserCustomerRead extends UserCustomer {
  totalRecords: number
}
