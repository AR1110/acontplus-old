using Domain.Models.Compras;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Compras
{
    public class NotaVentaDetalleViewModel
    {
        public NotaVentaDetalle detalle { get; set; }
        public string codigo { get; set; }
        public bool llevaInventario { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }
    }
}
