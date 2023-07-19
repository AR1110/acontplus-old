using Domain.Models.Almacen;

namespace Domain.ViewModels.Almacen
{
    public class MedidaViewModel
    {
        public Medida medida { get; set; }
        public int totalRecords { get; set; }
        public int idArticulo { get; set; }
        public string tipoArticulo { get; set; }
        public bool xdefecto { get; set; }
        public decimal precioCosto { get; set; }
    }
}
