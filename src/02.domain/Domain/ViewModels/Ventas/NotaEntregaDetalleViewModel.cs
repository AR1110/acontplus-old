using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class NotaEntregaDetalleViewModel
    {
        public NotaEntregaDetalle detalle { get; set; }
        public string nombreMedida { get; set; }
        public string codigo { get; set; }
        public string nombreTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
        public string presentacion { get; set; }
        public decimal porcentajeTipoIva { get; set; }
        public bool datosAdicionales { get; set; }
    }
}
