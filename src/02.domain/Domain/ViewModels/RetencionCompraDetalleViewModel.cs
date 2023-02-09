using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class RetencionCompraDetalleViewModel
    {
        public RetencionCompraDetalle retencionCompraDetalle { get; set; }
        public string codigoImpuesto { get; set; }
        public string tipoRetencion { get; set; }
        public string impuesto { get; set; }
        public string fechaEmision { get; set; }
        public string nroDocumento { get; set; }
        public string icono { get; set; }
        public int codigoRetencion { get; set; }
    }
}
