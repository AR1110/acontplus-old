using Domain.Models.Almacen;
using System.Collections.Generic;

namespace Domain.ViewModels
{
    public class ArticuloFraccionadoViewModel
    {
        public ArticuloFraccionado fraccionado { get; set; }
        public List<ArticuloFraccionadoPvP> pvps { get; set; }
        public string articulo { get; set; }
        public string nombreMedida { get; set; }
        public int totalRecords { get; set; }
        public string codigo { get; set; }
        public decimal precioCosto { get; set; }
    }

    public class ArticuloFraccionadoData
    {
        public ArticuloFraccionadoViewModel fraccionado { get; set; }
        public List<ArticuloFraccionadoPvPViewModel> pvps { get; set; }
    }
}
