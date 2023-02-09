using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Generic
{
    public class Documento
    {
        public int idComprobante { get; set; }
        public int idTipoDocumento { get; set; }
        public string fechaEmision { get; set; }
        public string fechaVencimiento { get; set; }
        public string nroDocumento { get; set; }
        public decimal total { get; set; }
        public string estadoFinanciero { get; set; }
        public string codigoColor { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public string tipoDocumento { get; set; }
        public decimal posfechado { get; set; }
        public string nroFactura { get; set; }


    }

}
