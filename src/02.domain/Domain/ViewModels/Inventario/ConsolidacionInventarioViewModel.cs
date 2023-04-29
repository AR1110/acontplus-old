using Domain.Models.Inventario;

namespace Domain.ViewModels.Inventario
{
    public class ConsolidacionInventarioViewModel
    {
        public ConsolidacionInventario consolidacion { get; set; }
        public List<ConsolidacionInventarioDetalle> detalle { get; set; }
        public string nroDoc { get; set; }
        public decimal total { get; set; }
        public string usuario { get; set; }
        public string style { get; set; }

    }

    public class ConsolidacionInventarioData
    {
        public ConsolidacionInventarioViewModel consolidacion { get; set; }
        public List<ConsolidacionInventarioDetalleViewModel> detalle { get; set; }
    }
}
