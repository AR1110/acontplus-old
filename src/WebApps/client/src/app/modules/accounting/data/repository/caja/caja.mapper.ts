export class CajaMapper {

  static fromApiGetAll(response:any){
    let cajas = response.cajas || [];

    return cajas.map((item:any)=>{


      return {
        idCaja: item.idCaja,
        descripcion: item.descripcion,
        estado: item.estado,
        actividad: item.actividad,
        usuario: item.usuario,
        turno: item.turno,
        idTurno:item.idTurno,
        idUsuario: item.idUsuario,
        nomEstado: item.estado?'Activo': '',
        totalRecords: item.totalRecords
      }

    })

  }

}
