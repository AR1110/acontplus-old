using Domain.Models.Inventario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Inventario
{
    public class ConsolidacionInventarioDetalleViewModel
    {
        public ConsolidacionInventarioDetalle detalle { get; set; }
        public string codigo { get; set; }
        public string nombreMedida { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public decimal ice { get; set; }
        public decimal stock { get; set; }
    }
}
