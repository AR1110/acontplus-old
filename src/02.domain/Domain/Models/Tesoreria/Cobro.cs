using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Tesoreria
{
    public class Cobro
    {
        public long idCobro { get; set; }
        public int idEntidadFinanciera { get; set; }
        public int idSubEntidadFinanciera { get; set; }
        public long idBanco { get; set; }
        public long idCuentaBancaria { get; set; }
        public long idTipoDocumento { get; set; }
        public long idComprobante { get; set; }
        public long idCiudad { get; set; }
        public decimal valor { get; set; }
        public decimal abono { get; set; }
        public decimal vuelto { get; set; }
        public string fechaEmision { get; set; }
        public bool posfechado { get; set; }
        public int secuencial { get; set; }
        public string nro { get; set; }
        public string lote { get; set; }
        public string aprobacion { get; set; }
        public string referencia { get; set; }
        public bool controlCaja { get; set; }


    }
}
