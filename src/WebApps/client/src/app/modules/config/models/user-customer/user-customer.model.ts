export interface UserCustomer {
  idUsuario: number;
  nroIdentificacion: string;
  nombreUsuario: string;
  email: string;
  nombreCompleto: string;
  firstName: string;
  lastName: string;
}

export interface UserCustomerRead extends UserCustomer {
  totalRecords: number;
}
