export interface LicenciaPlan {
  idLicenciaPlan:number
  idLicencia:number
  idAplicacion:number
  codLicencia:string
  codAplicacion:string
  aplicacion:string
  licencia:string
  costo:number
  impuesto:number
  descuento:number
  estado:boolean
}


export interface LicenciaPlanUpdateDTO{
  idAplicacion: number
  costo:number
  impuesto:number
  descuento: number
  estado:boolean
}
