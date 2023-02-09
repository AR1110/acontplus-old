using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.ConfigEmpresa
{
    public class CantidadDecimal
    {
        public int idCantidadDecimal { get; set; }
        public int idEntidad { get; set; }
        public int idTipoTransaccion { get; set; }
        public int nroPrecio { get; set; }
        public int nroCantidad { get; set; }
        public int nroIva { get; set; }
        public int nroDescuentoDetalle { get; set; }
        public int nroTotalDetalle { get; set; }
        public int nroTotalSubTotal { get; set; }
        public int nroDescuento { get; set; }
        public int nroIce { get; set; }
        public string ruc { get; set; }
        public string codTransaccion { get; set; }
        public bool estado { get; set; }
    }
}
