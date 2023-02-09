using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Impuesto
    {
        public int idImpuesto { get; set; }
        public string codigoAnexo { get; set; }
        public string descripcion { get; set; }
        public decimal porcentaje { get; set; }
        public string campoFormulario103 { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public string fechaBaja { get; set; }
        public int totalRecords { get; set; }
    }

    public class ImpuestoOperaciones
    {
        public Impuesto impuesto { get; set; }
        public TipoImpuesto tipoImpuesto { get; set; }
    }
}